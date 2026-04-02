//Validation for URL
const isValidUrl=(urlString)=>{
    try{
        const parsed = new URL(urlString);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch(err){
        return false;
    }
}
module.exports = isValidUrl;