

function estimatePrice(device) {
    let basePrice;
alert(JSON.stringify(device))
    
    switch (device.deviceType) {
        case 'smartphone':
            basePrice = 400;  
            break;
        case 'laptop':
            basePrice = 700;  
            break;
        case 'tablet':
            basePrice = 300;
            break;
        default:
            return 0; 
    }


    if (device.brand === 'apple' || device.brand === 'samsung') {
        basePrice *= 1.2;
    }

    const capacity = parseInt(device.storageCapacity);
    
    const currentYear = new Date().getFullYear();
    const yearOfPurchase = parseInt(device.yearOfPurchase);
    const deviceAge = currentYear - yearOfPurchase;
    
    if (deviceAge <= 1) {
        basePrice *= 0.95;  
    } else if (deviceAge <= 3) {
        basePrice *= 0.85;  
    } else if (deviceAge <= 5) {
        basePrice *= 0.7;  
    } else {
        basePrice *= 0.5;  
    }

    
    switch (device.condition) {
        case 'new':
            basePrice *= 1;  
            break;
        case 'used':
            basePrice *= 0.8;  
            break;
        case 'damaged':
            basePrice *= 0.5;  
            break;
    }

    
    if (capacity >= 256) {
        basePrice *= 1.15;  
    } else if (capacity >= 128) {
        basePrice *= 1.1;  
    }

    
    if (device.defects.includes('screen crack')) {
        basePrice *= 0.7;  
    }
    if (device.defects.includes('battery issue')) {
        basePrice *= 0.85; 
    }
    if (device.defects.includes('malfunctioning buttons')) {
        basePrice *= 0.9;  
    }

    
    const minimumPrice = 50;
    return Math.max(basePrice, minimumPrice);  
}
export default estimatePrice;