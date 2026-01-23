from rest_framework.exceptions import APIException


class EmailAlreadyExistsError(APIException):
    status_code = 400
    default_detail = 'Email already exists'
    default_code = 'email_already_exists'


class UsernameAlreadyExistsError(APIException):
    status_code = 400
    default_detail = 'Username already exists'
    default_code = 'username_already_exists'
