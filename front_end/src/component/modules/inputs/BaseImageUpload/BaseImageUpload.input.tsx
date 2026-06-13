import { FC } from 'react';
import { Text, Image, SimpleGrid } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';

interface BaseImageUploadProps {
  files: FileWithPath[];
  onSetFiles: (files: FileWithPath[]) => void;
  isUploadImageLoading: boolean;
}
const BaseImageUpload: FC<BaseImageUploadProps> = ({
  files,
  onSetFiles,
  isUploadImageLoading,
}) => {
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index + 1}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
      />
    );
  });

  return (
    <div>
      <Dropzone
        loading={isUploadImageLoading}
        accept={IMAGE_MIME_TYPE}
        onDrop={onSetFiles}
      >
        <Text ta="center">عکس خود را آپلود کنید</Text>
      </Dropzone>

      <SimpleGrid cols={{ base: 2, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
        {previews}
      </SimpleGrid>
    </div>
  );
};
export default BaseImageUpload;
