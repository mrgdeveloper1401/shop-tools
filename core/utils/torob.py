def torob_header(token):
    text = {
        "Content-Type: application/json",
        "Accept: application/json",
        "X-Torob-Token: {}".format(token),
        "C-Torob-Token-Version: 1"
    }
    return text


