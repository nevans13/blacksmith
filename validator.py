# blacksmith input validator
# v1.0.0 - 10/15/2025
# nevans13

# Validate a given input based on its type
def vdt(input, type):
    try:
        match type:
            case "hostname":
                if type(input) != str: raise ValueError("Hostname is invalid type")
                if len(input) >= 100: raise ValueError("Hostname is too long")
                return True
            case _:
                raise ValueError("Unknown input type " + str(type))
                
    except:
        raise Exception("Error trying to validate input")