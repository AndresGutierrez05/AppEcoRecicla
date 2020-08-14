export const GetColorTag = typeObjectRequest => {
        switch(typeObjectRequest){
            case "Vidrio" :
                return "green";
            case "Plastico" :
                return "cyan";
            case "Metal" :
                return "blue";
            case "Pilas y baterias" :
                return "geekblue";
            case "Papel" :
                return "purple";
            case "Carton" :
                return "lime";
            case "Textil" :
                return "gold";
            case "Bolsa" :
                return "red";
        }
}

export const GetColorState = typeObjectRequest => {
    switch(typeObjectRequest){
        case 1 :
            return "red";
        case 2 :
            return "orange";
        case 3 :
            return "purple";
        case 4 :
            return "green";
    }
}

export const GetNameState = typeObjectRequest => {
    switch(typeObjectRequest){
        case 1 :
             return "No asignado";
        case 2 :
            return "Asignado";
        case 3 :
            return "En camino";
        case 4 :
            return "Entregado";
    }
}