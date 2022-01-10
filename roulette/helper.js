const getReturnAmount =async (amount, ratio)=>{
return amount * ratio;
}

const totalAmtToBePaid = async(stake) =>{
    return stake <= 2.5 ? stake : 0;
}

const getRandomNumber = () => {
    return Math.floor(Math.random() * (5-1) + 1);
    //return Math.floor(Math.random() * (max - min) + min)
}