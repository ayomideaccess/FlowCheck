export const generateSKU = (name, category)=> {
    const cat = category.slice(0,3).toUpperCase().replace(/\s/g, '');
    const prod = name.slice(0,3).toUpperCase().replace(/\s/g,'');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${cat}-${prod}-${rand}`;
};
