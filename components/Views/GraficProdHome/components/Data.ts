const productData = {
    id: 1,
    name: "Pizza Margherita",
    price: 12.99,
    currency: "USD",
    duration: "30 minutos",
    description: "Deliciosa pizza Margherita con salsa de tomate, mozzarella fresca y albahaca. Perfecta para una comida rápida y sabrosa.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Eataly_Las_Vegas_-_Feb_2019_-_Sarah_Stierch_12.jpg",
    category: "Comida Italiana",
    rating: 4.7,
    reviews: 230,
    tags: ["Pizza", "Italiana", "Vegetariana"]
};

const salesData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [{
        data: [120, 150, 180, 200, 250, 300, 280]
    }]
};

const categoryData = {
    labels: ["Pizza", "Pasta", "Ensalada", "Postre"],
    datasets: [{
        data: [500, 300, 200, 150]
    }]
};

const satisfactionData = {
    data: [90, 10]
};

export { productData, salesData, categoryData, satisfactionData };