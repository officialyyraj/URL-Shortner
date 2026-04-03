//Validation for URL
const isValidUrl=(urlString)=>{
    try{
        urlString = urlString.trim();
        const parsed = new URL(urlString);
        
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch(err){
        return false;
    }
}
module.exports = isValidUrl;