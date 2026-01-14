export const getNickNames = (name: string) => {
    const splitNames = name.split(" ");
    if(splitNames.length === 1){
        return splitNames[0].charAt(0).toUpperCase();
    }else{
        return splitNames[0].charAt(0).toUpperCase() + splitNames[1].charAt(0).toUpperCase()
    }
}