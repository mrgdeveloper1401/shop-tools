import boto3
from rest_framework.exceptions import ValidationError
from boto3.s3.transfer import TransferConfig
from decouple import config
import certifi


KB = 1024
MB = KB * KB
GB = MB * KB
DEBUG = config("DEBUG", cast=bool, default=False)


class Bucket:
    def __init__(self, dj_env_debug_mode=DEBUG):
        self.service_name = "s3"
        self.bucket_name = config("ARVAN_CLOUD_BACKUP_BUCKET_NAME", cast=str)
        self.endpoint_url = config("ARVAN_CLOUD_BUCKET_BACKUP_URL", cast=str)
        self.aws_access_key_id = config("ARVAN_CLOUD_BUCKET_ACCESS_KEY", cast=str)
        self.aws_secret_access_key = config("ARVAN_CLOUD_BUCKET_ACCESS_SECRET_KEY", cast=str)
        self.region_name = config("ARVAN_CLOUD_BACKUP_REGION_NAME", cast=str, default="eu-west-1")
        # self.api_version = config("ARVAN_CLOUD_BACKUP_API_VERSION", cast=str, default=None)

        # check verify
        if dj_env_debug_mode:
            self.verify = certifi.where()
            self.use_ssl = False
        else:
            self.verify = True
            self.use_ssl = True

    def bucket_s3_resourse(self):
        s3_resource = boto3.resource(
            service_name=self.service_name,
            region_name=self.region_name,
            # api_version=self.api_version,
            use_ssl=self.use_ssl,
            verify=self.verify,
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key
        )
        return s3_resource

    def bucket_s3_client(self):
        s3_client = boto3.client(
            service_name=self.service_name,
            region_name=self.region_name,
            # api_version=self.api_version,
            use_ssl=self.use_ssl,
            verify=self.verify,
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key
        )
        return s3_client

    def create_object_for_backup(self, file_name, file_path=None):
        bucket = self.bucket_s3_resourse.Bucket(self.bucket_name)
        if file_path is None:
            file_path = "/backup/gs-tools-database/"
        else:
            file_path = file_path
        object_name = file_name

        with open(file_path, "rb") as f:
            bucket.put_object(
                ACL="private",
                Body=f,
                Key=object_name
            )

    def create_object_for_backup_as_multi_part(self, file_path, file_name):
        config = TransferConfig(
            multipart_threshold= 5 * MB,
            max_concurrency=10,
            multipart_chunksize=5 * MB
        )
        try:
            upload = self.bucket_s3_client().upload_file(
                file_path,
                self.bucket_name,
                file_name,
                ExtraArgs={'ACL': 'private'},
                Config=config
            )
            return upload
        except Exception as e:
            raise ValidationError(str(e))


# b1 = Bucket()
# b1.create_object_for_backup_as_multi_part(
#     file_path="/home/mg/Pictures/flutter/f1.webp",
#     file_name="f1_1.webp"
# )