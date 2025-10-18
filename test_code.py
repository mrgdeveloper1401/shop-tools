class CreateOrderSerializer(serializers.Serializer):
    # ... فیلدهای موجود
    
    def create(self, validated_data):
        user = self.context['request'].user
        
        # بررسی موجودی قبل از ایجاد سفارش
        variant_ids = [item['product_variant_id'] for item in validated_data['items']]
        quantities = {item['product_variant_id']: item['quantity'] for item in validated_data['items']}
        
        # بررسی همزمان موجودی
        from django.db import transaction
        with transaction.atomic():
            variants = ProductVariant.objects.filter(id__in=variant_ids).select_for_update()
            
            for variant in variants:
                required_quantity = quantities[variant.id]
                if variant.stock_number < required_quantity:
                    raise serializers.ValidationError({
                        "message": f"موجودی محصول {variant.name} کافی نیست"
                    })
            
            # ایجاد سفارش
            profile = Profile.objects.filter(
                user_id=self.context["request"].user.id
            ).only("id").first()

            order = Order.objects.create(
                profile_id=profile.id, 
                address_id=validated_data.get("address_id"),
                shipping=validated_data.get("shipping"),
                first_name=validated_data.get("first_name"),
                last_name=validated_data.get("last_name"),
                phone=validated_data.get("phone"),
                description=validated_data.get("description"),
                items_data=validated_data.get("items")
            )

            # ایجاد آیتم‌های سفارش
            order_items = []
            for item in validated_data['items']:
                variant = ProductVariant.objects.get(id=item['product_variant_id'])
                order_items.append(
                    OrderItem(
                        order_id=order.id,
                        product_variant_id=variant.id,
                        price=variant.price,
                        quantity=item['quantity']
                    )
                )

            OrderItem.objects.bulk_create(order_items)
            
            # رزرو موجودی
            order.reserve_stock(duration_minutes=10)

        # محاسبات قیمت و درگاه پرداخت
        coupon = validated_data.get("valid_coupon")
        variants_data = [i for i in validated_data['items']]
        calc_total_price = order.total_price(
            coupon_code=coupon,
            variants=variants_data
        )

        if calc_total_price == 0:
            order.status = 'paid'
            order.is_complete = True
            order.payment_date = timezone.now()
            order.save()
            # ارسال نوتیفیکیشن
            # ...
        else:
            payment_gateway = request_gate_way(
                amount=calc_total_price,
                description=validated_data.get("description", None),
                order_id=order.id,
                mobile=validated_data.get("mobile_phone", None)
            )
            create_gateway_payment.delay(order.id, payment_gateway, user.id)

        return {
            "order_id": order.id,
            "reserved_until": order.reserved_until,
            "payment_gateway": payment_gateway if calc_total_price > 0 else None
        }