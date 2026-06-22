export const config = {
    Api: import.meta.env.VITE_API_URL || 
         (import.meta.env.DEV ? 'http://localhost:3001/api' : 'https://api.bambinapetshop.com/api')
};



// https://ecommers-petshop.onrender.com/api