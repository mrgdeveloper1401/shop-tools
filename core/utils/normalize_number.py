# convert no_ascii into ascii
PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹"
ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩"
ASCII_DIGITS = "0123456789"

TRANSLATION_TABLE = str.maketrans(
    PERSIAN_DIGITS + ARABIC_DIGITS,
    ASCII_DIGITS * 2
)

# func
def normalize_digits(value):
    if value.isascii():
        return value
    else:
        return value.translate(TRANSLATION_TABLE)
