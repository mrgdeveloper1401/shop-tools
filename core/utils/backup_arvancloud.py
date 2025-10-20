import boto3
from decouple import config


KB = 1024
MB = KB * KB
GB = MB * KB

class Bucket:
    def __init__(self):
        self.service_name = "s3"
        self.bucket_name = config("ARVAN_CLOUD_BACKUP_BUCKET_NAME", cast=str)
        self.endpoint_url = config("ARVAN_CLOUD_BUCKET_BACKUP_URL", cast=str)
        self.aws_access_key_id = config("ARVAN_CLOUD_BUCKET_ACCESS_KEY", cast=str)
        self.aws_secret_access_key = config("ARVAN_CLOUD_BUCKET_ACCESS_SECRET_KEY", cast=str)
        self.use_ssl = config('ARVAN_CLOUD_BACKUP_USE_SSL', default=True, cast=bool)
        self.region_name = config("ARVAN_CLOUD_BACKUP_REGION_NAME", cast=str, default="eu-west-1")
        self.api_version = config("ARVAN_CLOUD_BACKUP_API_VERSION", cast=str, default=None)
        self.verify = config("ARVAN_CLOUD_BACKUP_VERIFY", cast=str, default=None)

    def bucket_s3_resourse(self):
        s3_resource = boto3.resource(
            service_name=self.service_name,
            region_name=self.region_name,
            api_version=self.api_version,
            use_ssl=self.use_ssl,
            verify=self.verify,
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key
        )
        return s3_resource

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

    def create_object_for_backup_as_multi_part(self):
        pass

# b1 = Bucket()
# print(
    # b1.service_name,
    # b1.endpoint_url,
    # b1.aws_access_key_id,
    # b1.aws_secret_access_key,
    # b1.use_ssl,
    # b1.region_name,
    # b1.api_version,
    # b1.verify,
    # b1.bucket_name
# )

# print(GB)
