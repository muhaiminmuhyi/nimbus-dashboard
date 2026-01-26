export function format() {
    const ucWords = (str: string) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    }
    
    return {
        ucWords,
    }
}
