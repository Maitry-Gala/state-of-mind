export function random(len: number) : string {
    const options = "qwertyuiopasdfghjkl1234567890";
    const optionsLength = options.length;
    let ans = "";

    for(let i = 0; i < len; i++){
        ans+= options[Math.floor(Math.random
            () * optionsLength
        )];
    }
    return ans;
}