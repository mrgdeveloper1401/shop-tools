'use client';
import { FC } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useEditTagForm } from '@/hooks/formik/admin-dashboard/useEditTagFormik';

import Swal from 'sweetalert2';

import BaseDrawer from '../BaseDrawer/BaseDrawer';
import BaseTextInput from '../../inputs/BaseTextInput/BaseText.input';
import PrimaryButton from '../../PrimaryButton/Primary.button';
import EditIcon from '@/component/modules/icons/Edit.icon';

import { showSwal } from '@/utils/swalHelper';
import { submitEditTagApi } from '@/data/server_request/dashboard/product';
import styles from './TagEditButtonDrawer.module.css';

interface ITagEditButtonDrawerProps {
  TagId: number;
  callGetTagsApi: VoidFunction;
}
const TagEditButtonDrawer: FC<ITagEditButtonDrawerProps> = ({
  TagId,
  callGetTagsApi,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const submitHandler = async (values: any) => {
    Swal.fire({
      title: 'آیا از ادیت خود اطمینان دارید؟',
      icon: 'warning',
      iconHtml: '!',
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
      showCancelButton: true,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await submitEditTagApi(TagId, values);
          if (res.status === 200) {
            Swal.fire({
              title: 'تگ با موفقیت ادیت گردید.',
              text: '',
              icon: 'success',
              confirmButtonText: 'تایید',
            }).then(() => {
              close();
              callGetTagsApi();
            });
          } else {
            showSwal('دوباره تلاش کنید !', '', 'warning', 'سعی مجدد');
          }
        } catch (error) {
          // console.log(error);
        }
      }
    });
  };

  const { values, handleSubmit, errors, handleChange, setFieldValue } =
    useEditTagForm(submitHandler);

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="ادیت تگ"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={styles.form_container} onSubmit={handleSubmit}>
          <div className={styles.form}>
            <div className={styles.input}>
              <BaseTextInput
                name="tag_name"
                value={values.tag_name}
                error={errors.tag_name}
                label="عنوان تگ"
                leftSection={null}
                rightSection={null}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <PrimaryButton
              size="lg"
              variant="outline"
              type="button"
              onClick={close}
            >
              لغو
            </PrimaryButton>
            <PrimaryButton size="lg" variant="primary" type="submit">
              تایید
            </PrimaryButton>
          </div>
        </form>
      </BaseDrawer>
      <button onClick={open}>
        <EditIcon />
      </button>
    </>
  );
};
export default TagEditButtonDrawer;
