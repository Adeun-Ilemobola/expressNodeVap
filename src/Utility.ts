
export function minMax(min: number = 0, max: number = 100) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function idGenerator(length: number = 10):string {
    const alphabet = "zxcvbnmlkjhgfdsaqwertyuiopZXCVBNMLKJHGFDSAQWERTYUIOP0987654321"
    let segment = 0;
    let id =""
    while (segment < 3) {
        for (let i = 0; i < length; i++) {
            id += alphabet.charAt(minMax(0,alphabet.length -1));
        }
        if (segment < 2){
            id += '-';
        }
        segment++;
    }
    return id;

}


export  function addDays(date:Date, days:number) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}