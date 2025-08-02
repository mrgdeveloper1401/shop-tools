import json
from rest_framework import serializers, exceptions


class TextInputListField(serializers.ListField):
    def __init__(self, *args, **kwargs):
        style = {'base_template': 'input.html'}
        super().__init__(*args, style=style, **kwargs)

    def get_value(self, dictionary):
        value = super().get_value(dictionary)
        is_querydict = hasattr(dictionary, 'getlist')
        is_form = 'csrfmiddlewaretoken' in dictionary
        if value and is_querydict and is_form:
            try:
                value = json.loads(value[0])
            except Exception as e:
                raise exceptions.ValidationError(e)
        return value
