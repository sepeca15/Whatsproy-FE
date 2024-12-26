interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string; // Nueva propiedad
}

const sampleProducts: Product[] = [
    {
        id: 1,
        title: "Product 1",
        price: 19.99,
        description: "High-quality product with great value. This product is designed to provide exceptional performance and reliability, making it a great choice for anyone looking for quality and value.",
        imageUrl: "https://fotocreativo.com/wp-content/uploads/2019/10/fotografia-de-alimentos-ideas-creativas.jpg",
        category: "Food" // Nueva propiedad
    },
    {
        id: 2,
        title: "Product 2",
        price: 29.99,
        description: "Designed to meet your needs.",
        imageUrl: "https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_640.jpg",
        category: "Food" // Nueva propiedad
    },
    {
        id: 3,
        title: "Product 3",
        price: 39.99,
        description: "Exceptional performance and reliability. Crafted with precision and care, this product is built to last and provide you with the best experience possible.",
        imageUrl: "https://st.depositphotos.com/1328914/3359/i/450/depositphotos_33590291-stock-photo-mexican-food.jpg",
        category: "Food" // Nueva propiedad
    },
    {
        id: 4,
        title: "Product 4",
        price: 49.99,
        description: "Crafted with precision and care. This premium product is designed to offer superior quality and performance, making it a great choice for discerning customers.",
        imageUrl: "https://fotocreativo.com/wp-content/uploads/2019/10/fotografia-de-alimentos-ideas-creativas.jpg",
        category: "Food" // Nueva propiedad
    },
    {
        id: 5,
        title: "Product 5",
        price: 59.99,
        description: "Premium offering with style and functionality. This product is the perfect choice for those who demand the best in terms of quality, style, and performance.",
        imageUrl: "https://img.freepik.com/fotos-premium/sandwich-jamon-sabroso-delicioso-fotografia-publicitaria-fotografia-profesional-comida-comida-rapida_1030265-7893.jpg",
        category: "Food" // Nueva propiedad
    },
];

const availableCurrencies = ["USD", "EUR", "GBP"]; // Nueva lista de monedas

export { sampleProducts, Product, availableCurrencies };