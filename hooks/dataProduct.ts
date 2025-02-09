interface Product {
    id: number;
    title: string;
    price: number;
    currency: string;
    duration: string;
    description: string;
    imageUrl: string;
    category: string;
    rating: number;
    reviews: number;
    tags: string[];
}

interface ProductBDD {
    id: number;
    nombre: string;
    descripcion: string;
    disponible: boolean;
    empresa_id: number;
    plazoDuracionEstimadoMinutos: number;
    precio: number;
  }

interface SalesData {
    labels: string[];
    datasets: {
        data: number[];
    }[];
}

interface DayslySalesData {
    labels: string[];
    datasets: {
        data: number[];
    }[];
}

interface MonthlySalesData {
    labels: string[];
    datasets: {
        data: number[];
    }[];
}


interface CategoryData {
    labels: string[];
    datasets: {
        data: number[];
    }[];
}

interface SatisfactionData {
    data: number[];
}


const salesData: SalesData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [{
        data: [120, 150, 180, 200, 250, 300, 280]
    }]
};


  // Datos de ejemplo para ventas semanales y mensuales
  const dayslySalesData: DayslySalesData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{ data: [20, 45, 28, 80, 99, 43, 50] }]
  };


  
  const monthlySalesData: MonthlySalesData = {
    labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    datasets: [{ data: [300, 450, 280, 800, 990, 430, 500, 600, 700, 500, 600, 800] }]
  };

  

const categoryData: CategoryData = {
    labels: ["Pizza", "Pasta", "Ensalada", "Postre"],
    datasets: [{
        data: [500, 300, 200, 150]
    }]
};

const satisfactionData: SatisfactionData = {
    data: [90, 10]
};


const sampleProducts: Product[] = [
    {
        id: 1,
        title: "Pizza Margherita",
        price: 19.99,
        currency: "USD",
        duration: "100 min",
        rating: 4.5,
        reviews: 120,
        
        tags: ["cheese", "tomato", "basil"],
        description: "High-quality product with great value. This product is designed to provide exceptional performance and reliability, making it a great choice for anyone looking for quality and value.",
        imageUrl: "https://fotocreativo.com/wp-content/uploads/2019/10/fotografia-de-alimentos-ideas-creativas.jpg",
        category: "Vegetariana"
    },
    {
        id: 2,
        title: "Spaghetti Carbonara",
        price: 29.99,
        currency: "USD",
        duration: "6 months",
        rating: 4.0,
        reviews: 80,
        tags: ["pasta", "bacon", "cream"],
        description: "Designed to meet your needs.",
        imageUrl: "https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_640.jpg",
        category: "Food"
    },
    {
        id: 3,
        title: "Caesar Salad",
        price: 39.99,
        currency: "USD",
        duration: "2 years",
        rating: 4.8,
        reviews: 150,
        tags: ["lettuce", "croutons", "parmesan"],
        description: "Exceptional performance and reliability. Crafted with precision and care, this product is built to last and provide you with the best experience possible.",
        imageUrl: "https://st.depositphotos.com/1328914/3359/i/450/depositphotos_33590291-stock-photo-mexican-food.jpg",
        category: "Food"
    },
    {
        id: 4,
        title: "Chocolate Cake",
        price: 49.99,
        currency: "USD",
        duration: "1 year",
        rating: 4.7,
        reviews: 110,
        tags: ["chocolate", "dessert", "sweet"],
        description: "Crafted with precision and care. This premium product is designed to offer superior quality and performance, making it a great choice for discerning customers.",
        imageUrl: "https://fotocreativo.com/wp-content/uploads/2019/10/fotografia-de-alimentos-ideas-creativas.jpg",
        category: "Food"
    },
    {
        id: 5,
        title: "Ham Sandwich",
        price: 59.99,
        currency: "USD",
        duration: "3 years",
        rating: 4.9,
        reviews: 200,
        tags: ["ham", "bread", "cheese"],
        description: "Premium offering with style and functionality. This product is the perfect choice for those who demand the best in terms of quality, style, and performance.",
        imageUrl: "https://img.freepik.com/fotos-premium/sandwich-jamon-sabroso-delicioso-fotografia-publicitaria-fotografia-profesional-comida-comida-rapida_1030265-7893.jpg",
        category: "Food"
    }
];






const availableCurrencies = ["USD", "EUR", "GBP"];

export { sampleProducts, ProductBDD, Product, availableCurrencies , satisfactionData, categoryData, salesData, SatisfactionData, CategoryData, SalesData, dayslySalesData, DayslySalesData, monthlySalesData, MonthlySalesData}; 