export interface ProductVariant {
    name: string;
    price: number;
}

export interface MenuItem {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    rating: number;
    isVeg?: boolean;
    isChefSpecial?: boolean;
    variants: ProductVariant[];
}

export const CATEGORIES = [
    "All",
    "Indian Veg",
    "Chicken Specialities",
    "Pork Specialities",
    "Paneer Specialities",
    "Dal & Breads",
    "Starters & Snacks",
    "Chinese Cuisine",
    "Momos",
    "Rolls & Burgers",
    "Korean Cuisine",
    "Local Specialities",
    "Beverages",
    "Healthy Corner",
    "Manchurian"
];

export const PRODUCTS: MenuItem[] = [
    // ----------------------------------------------------
    // PAGE 1: INDIAN CUISINE - VEGETARIAN SPECIALITIES
    // ----------------------------------------------------
    {
        id: "veg-pulao",
        name: "Veg Pulao",
        category: "Indian Veg",
        description: "Fragrant rice cooked with fresh vegetables and aromatic spices.",
        image: "/dishes/veg_pulao.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 130 }]
    },
    {
        id: "peas-pulao",
        name: "Peas Pulao",
        category: "Indian Veg",
        description: "Flavourful rice prepared with green peas and mild Indian spices.",
        image: "/dishes/peas_pulao.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 140 }]
    },
    {
        id: "mixed-veg",
        name: "Mixed Veg",
        category: "Indian Veg",
        description: "Seasonal vegetables cooked in a traditional Indian gravy.",
        image: "/dishes/mixed_veg.jpg",
        rating: 4.6,
        isVeg: true,
        variants: [{ name: "Standard", price: 160 }]
    },
    {
        id: "jeera-aloo",
        name: "Jeera Aloo",
        category: "Indian Veg",
        description: "Potato cubes sautéed with cumin seeds and Indian spices.",
        image: "/dishes/jeera_aloo.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "dum-aloo",
        name: "Dum Aloo",
        category: "Indian Veg",
        description: "Potatoes slow-cooked in a rich, aromatic gravy.",
        image: "/dishes/dum_aloo.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 280 }]
    },
    {
        id: "green-salad",
        name: "Green Salad",
        category: "Indian Veg",
        description: "A refreshing assortment of fresh greens and seasonal vegetables.",
        image: "/dishes/green_salad.jpg",
        rating: 4.6,
        isVeg: true,
        variants: [{ name: "Standard", price: 160 }]
    },
    {
        id: "onion-salad",
        name: "Onion Salad",
        category: "Indian Veg",
        description: "Freshly sliced onions served with lemon and seasoning.",
        image: "/dishes/onion_salad.jpg",
        rating: 4.5,
        isVeg: true,
        variants: [{ name: "Standard", price: 60 }]
    },

    // ----------------------------------------------------
    // PAGE 1 & 2: CHICKEN SPECIALITIES
    // ----------------------------------------------------
    {
        id: "chicken-thali",
        name: "Chicken Thali",
        category: "Chicken Specialities",
        description: "A wholesome meal with rice, three different chicken preparations and traditional accompaniments.",
        image: "/dishes/chicken_thali.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "Standard", price: 300 }]
    },
    {
        id: "chicken-pulao",
        name: "Chicken Pulao",
        category: "Chicken Specialities",
        description: "Aromatic rice cooked with tender chicken pieces and traditional spices.",
        image: "/dishes/chicken_pulao.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 190 }]
    },
    {
        id: "chicken-biryani",
        name: "Chicken Biryani",
        category: "Chicken Specialities",
        description: "Fragrant rice layered with flavourful chicken and biryani spices.",
        image: "/dishes/chicken_biryani.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "Standard", price: 280 }]
    },
    {
        id: "chicken-curry",
        name: "Chicken Curry",
        category: "Chicken Specialities",
        description: "Tender chicken simmered in a traditional onion-tomato gravy.",
        image: "/dishes/chicken_curry.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 149 },
            { name: "Full", price: 299 }
        ]
    },
    {
        id: "chicken-butter-masala",
        name: "Chicken Butter Masala",
        category: "Chicken Specialities",
        description: "Tender chicken in a rich, creamy tomato gravy blended with butter, fresh cream and aromatic spices.",
        image: "/dishes/chicken_butter_masala.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 179 },
            { name: "Full", price: 329 }
        ]
    },
    {
        id: "chicken-kosha",
        name: "Chicken Kosha",
        category: "Chicken Specialities",
        description: "Chicken slow-cooked in a thick, rich gravy with traditional spices.",
        image: "/dishes/chicken_kosha.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 380 }]
    },
    {
        id: "afghani-chicken",
        name: "Afghani Chicken",
        category: "Chicken Specialities",
        description: "Chicken marinated in a creamy, mildly spiced mixture and cooked until tender.",
        image: "/dishes/afghani_chicken.jpg",
        rating: 4.9,
        variants: [{ name: "Standard", price: 390 }]
    },
    {
        id: "kadhai-chicken",
        name: "Kadhai Chicken",
        category: "Chicken Specialities",
        description: "Chicken cooked with capsicum, onions, tomatoes and freshly ground kadhai spices.",
        image: "/dishes/kadhai_chicken.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 380 }]
    },
    {
        id: "chicken-do-pyaza",
        name: "Chicken Do Pyaza",
        category: "Chicken Specialities",
        description: "Chicken curry prepared with generous portions of onions and aromatic spices.",
        image: "/dishes/chicken_do_pyaza.jpg",
        rating: 4.7,
        variants: [{ name: "Standard", price: 390 }]
    },
    {
        id: "chicken-rogan-josh",
        name: "Chicken Rogan Josh",
        category: "Chicken Specialities",
        description: "A rich, aromatic chicken curry infused with traditional spices.",
        image: "/dishes/chicken_rogan_josh.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 370 }]
    },
    {
        id: "patiala-chicken",
        name: "Patiala Chicken",
        category: "Chicken Specialities",
        description: "A hearty Punjabi-style chicken preparation in a rich, spiced gravy.",
        image: "/dishes/patiala_chicken.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 380 }]
    },
    {
        id: "pahadi-chicken",
        name: "Pahadi Chicken",
        category: "Chicken Specialities",
        description: "Chicken prepared with aromatic herbs and mountain-inspired spices.",
        image: "/dishes/pahadi_chicken.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 380 }]
    },

    // ----------------------------------------------------
    // PAGE 3: PORK SPECIALITIES
    // ----------------------------------------------------
    {
        id: "pork-thali",
        name: "Pork Thali",
        category: "Pork Specialities",
        description: "A complete meal featuring rice, pork and traditional accompaniments.",
        image: "/dishes/pork_thali.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Regular", price: 159 },
            { name: "Special", price: 359 }
        ]
    },
    {
        id: "pork-dry-fry",
        name: "Pork Dry Fry",
        category: "Pork Specialities",
        description: "Pork pieces fried with aromatic spices for a flavourful finish.",
        image: "/dishes/pork_dry_fry.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 159 },
            { name: "Full", price: 300 }
        ]
    },
    {
        id: "pork-curry",
        name: "Pork Curry",
        category: "Pork Specialities",
        description: "Pork pieces slowly cooked in a traditional spicy gravy.",
        image: "/dishes/pork_curry.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 149 },
            { name: "Full", price: 289 }
        ]
    },
    {
        id: "pork-stick",
        name: "Pork Stick",
        category: "Pork Specialities",
        description: "Seasoned pork pieces prepared on skewers.",
        image: "/dishes/pork_stick.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 360 }]
    },

    // ----------------------------------------------------
    // PAGE 3: PANEER SPECIALITIES
    // ----------------------------------------------------
    {
        id: "matar-paneer",
        name: "Matar Paneer",
        category: "Paneer Specialities",
        description: "Soft paneer cubes and green peas cooked in Indian gravy.",
        image: "/dishes/matar_paneer.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 230 }]
    },
    {
        id: "paneer-butter-masala",
        name: "Paneer Butter Masala",
        category: "Paneer Specialities",
        description: "Paneer cubes simmered in a rich, creamy tomato and butter-based gravy.",
        image: "/dishes/paneer_butter_masala.jpg",
        rating: 4.9,
        isVeg: true,
        isChefSpecial: true,
        variants: [{ name: "Standard", price: 239 }]
    },
    {
        id: "kadhai-paneer",
        name: "Kadhai Paneer",
        category: "Paneer Specialities",
        description: "Paneer cooked with capsicum, onions and freshly ground kadhai spices.",
        image: "/dishes/kadhai_paneer.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 270 }]
    },
    {
        id: "paneer-do-pyaza",
        name: "Paneer Do Pyaza",
        category: "Paneer Specialities",
        description: "Paneer cooked with generous portions of onions and aromatic spices.",
        image: "/dishes/paneer_do_pyaza.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 280 }]
    },
    {
        id: "tawa-paneer",
        name: "Tawa Paneer",
        category: "Paneer Specialities",
        description: "Paneer tossed on a hot tawa with onions, capsicum and spices.",
        image: "/dishes/tawa_paneer.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 290 }]
    },
    {
        id: "pahadi-paneer",
        name: "Pahadi Paneer",
        category: "Paneer Specialities",
        description: "Paneer prepared with aromatic herbs and mountain-style spices.",
        image: "/dishes/pahadi_paneer.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 240 }]
    },

    // ----------------------------------------------------
    // PAGE 3: DAL & OTHER INDIAN SPECIALITIES & BREADS
    // ----------------------------------------------------
    {
        id: "dal-fry",
        name: "Dal Fry",
        category: "Dal & Breads",
        description: "Yellow lentils cooked with onions, tomatoes and traditional spices.",
        image: "/dishes/dal_fry.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "dal-tadka",
        name: "Dal Tadka",
        category: "Dal & Breads",
        description: "Yellow lentils finished with a tempering of garlic, cumin and spices.",
        image: "/dishes/dal_tadka.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 180 }]
    },
    {
        id: "dal-makhani",
        name: "Dal Makhani",
        category: "Dal & Breads",
        description: "Slow-cooked lentils prepared with butter, cream and rich spices.",
        image: "/dishes/dal_makhani.jpg",
        rating: 4.9,
        isVeg: true,
        variants: [{ name: "Standard", price: 260 }]
    },
    {
        id: "egg-curry",
        name: "Egg Curry",
        category: "Dal & Breads",
        description: "Boiled eggs simmered in onion-tomato gravy with Indian spices.",
        image: "/dishes/egg_curry.jpg",
        rating: 4.7,
        variants: [{ name: "Standard", price: 160 }]
    },
    {
        id: "butter-roti",
        name: "Butter Roti",
        category: "Dal & Breads",
        description: "Freshly prepared Indian flatbread brushed with butter.",
        image: "/dishes/butter_roti.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "1 Pc", price: 20 }]
    },
    {
        id: "tawa-roti",
        name: "Tawa Roti",
        category: "Dal & Breads",
        description: "Traditional whole-wheat flatbread cooked on a hot tawa.",
        image: "/dishes/tawa_roti.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "1 Pc", price: 15 }]
    },

    // ----------------------------------------------------
    // PAGE 4: VEG & NON-VEG STARTERS
    // ----------------------------------------------------
    {
        id: "veg-pakoda",
        name: "Veg Pakoda (8 Pcs)",
        category: "Starters & Snacks",
        description: "Crispy vegetable fritters coated in seasoned batter and deep-fried.",
        image: "/dishes/veg_pakoda.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "8 Pcs", price: 100 }]
    },
    {
        id: "onion-pakoda",
        name: "Onion Pakoda (8 Pcs)",
        category: "Starters & Snacks",
        description: "Crunchy onion fritters prepared with gram flour and spices.",
        image: "/dishes/onion_pakoda.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "8 Pcs", price: 100 }]
    },
    {
        id: "paneer-pakoda",
        name: "Paneer Pakoda (8 Pcs)",
        category: "Starters & Snacks",
        description: "Paneer cubes coated in spiced batter and fried until golden.",
        image: "/dishes/paneer_pakoda.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "8 Pcs", price: 180 }]
    },
    {
        id: "french-fries",
        name: "French Fries",
        category: "Starters & Snacks",
        description: "Golden, crispy potato fries served with seasoning.",
        image: "/dishes/french_fries.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 100 }]
    },
    {
        id: "honey-chilli-potato",
        name: "Honey Chilli Potato",
        category: "Starters & Snacks",
        description: "Crispy potato fingers tossed in a sweet, spicy and tangy sauce.",
        image: "/dishes/honey_chilli_potato.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 150 }]
    },
    {
        id: "crispy-chilli-baby-corn",
        name: "Crispy Chilli Baby Corn",
        category: "Starters & Snacks",
        description: "Crunchy baby corn tossed with chillies, sauces and Chinese seasonings.",
        image: "/dishes/crispy_chilli_baby_corn.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 180 }]
    },
    {
        id: "american-corn-salt-pepper",
        name: "American Corn Salt & Pepper",
        category: "Starters & Snacks",
        description: "American corn tossed with salt, pepper and aromatic seasoning.",
        image: "/dishes/american_corn.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 180 }]
    },
    {
        id: "chicken-pakoda",
        name: "Chicken Pakoda (8 Pcs)",
        category: "Starters & Snacks",
        description: "Juicy chicken pieces coated in seasoned batter and fried until crispy.",
        image: "/dishes/chicken_pakoda.jpg",
        rating: 4.9,
        variants: [{ name: "8 Pcs", price: 120 }]
    },

    // ----------------------------------------------------
    // PAGE 4: CHICKEN STARTERS
    // ----------------------------------------------------
    {
        id: "chicken-dry-fry",
        name: "Chicken Dry Fry",
        category: "Starters & Snacks",
        description: "Chicken pieces fried with aromatic spices for a crispy finish.",
        image: "/dishes/chicken_dry_fry.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 150 },
            { name: "Full", price: 280 }
        ]
    },
    {
        id: "chilli-chicken",
        name: "Chilli Chicken",
        category: "Starters & Snacks",
        description: "Chicken tossed with chillies, onions, capsicum and spicy Chinese sauces.",
        image: "/dishes/chilly_chicken.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 160 },
            { name: "Full", price: 300 }
        ]
    },
    {
        id: "garlic-chicken",
        name: "Garlic Chicken",
        category: "Starters & Snacks",
        description: "Tender chicken pieces tossed in a rich, aromatic garlic-infused preparation.",
        image: "/dishes/garlic_chicken.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 150 },
            { name: "Full", price: 300 }
        ]
    },
    {
        id: "lemon-chicken",
        name: "Lemon Chicken",
        category: "Starters & Snacks",
        description: "Chicken tossed in a refreshing, tangy lemon-flavoured sauce.",
        image: "/dishes/lemon_chicken.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 170 },
            { name: "Full", price: 300 }
        ]
    },
    {
        id: "chicken-65",
        name: "Chicken 65",
        category: "Starters & Snacks",
        description: "Spicy fried chicken tossed with curry leaves and aromatic spices.",
        image: "/dishes/chicken_65.jpg",
        rating: 4.9,
        variants: [
            { name: "Half", price: 190 },
            { name: "Full", price: 290 }
        ]
    },
    {
        id: "honey-chicken",
        name: "Honey Chicken",
        category: "Starters & Snacks",
        description: "Crispy chicken coated in a sweet and savoury honey glaze.",
        image: "/dishes/honey_chicken.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 150 },
            { name: "Full", price: 280 }
        ]
    },
    {
        id: "chicken-salt-pepper",
        name: "Chicken Salt & Pepper",
        category: "Starters & Snacks",
        description: "Crispy chicken tossed with crushed black pepper and seasoning.",
        image: "/dishes/chicken_salt_pepper.jpg",
        rating: 4.7,
        variants: [
            { name: "Half", price: 150 },
            { name: "Full", price: 280 }
        ]
    },
    {
        id: "butter-chicken-starter",
        name: "Butter Chicken (Starter)",
        category: "Starters & Snacks",
        description: "Chicken pieces tossed in a rich, buttery preparation.",
        image: "/dishes/butter_chicken_starter.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 180 },
            { name: "Full", price: 350 }
        ]
    },
    {
        id: "kurkure-chicken",
        name: "Kurkure Chicken (Crispy Chicken)",
        category: "Starters & Snacks",
        description: "Crunchy, golden-fried chicken pieces seasoned with aromatic spices.",
        image: "/dishes/kurkure_chicken.jpg",
        rating: 4.9,
        variants: [
            { name: "Half", price: 140 },
            { name: "Full", price: 260 }
        ]
    },
    {
        id: "chicken-lollipop",
        name: "Chicken Lollipop",
        category: "Starters & Snacks",
        description: "Chicken lollipops marinated with spices and fried until crispy.",
        image: "/dishes/chicken_lollipop.jpg",
        rating: 4.9,
        variants: [{ name: "Standard", price: 180 }]
    },
    {
        id: "drums-of-heaven",
        name: "Drums of Heaven",
        category: "Starters & Snacks",
        description: "Crispy chicken drumettes tossed in a spicy Indo-Chinese sauce.",
        image: "/dishes/drums_of_heaven.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "Standard", price: 300 }]
    },

    // ----------------------------------------------------
    // PAGE 5: CHINESE CUISINE - FRIED RICE
    // ----------------------------------------------------
    {
        id: "chicken-fried-rice",
        name: "Chicken Fried Rice",
        category: "Chinese Cuisine",
        description: "Stir-fried rice with chicken, vegetables, egg and Chinese seasonings.",
        image: "/dishes/chicken_fried_rice.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 70 },
            { name: "Full", price: 130 }
        ]
    },
    {
        id: "veg-fried-rice",
        name: "Veg Fried Rice",
        category: "Chinese Cuisine",
        description: "Flavourful rice tossed with fresh vegetables and Chinese sauces.",
        image: "/dishes/veg_fried_rice.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [
            { name: "Half", price: 50 },
            { name: "Full", price: 100 }
        ]
    },
    {
        id: "lemon-chicken-fried-rice",
        name: "Lemon Chicken Fried Rice",
        category: "Chinese Cuisine",
        description: "Fried rice tossed with chicken and a refreshing hint of lemon.",
        image: "/dishes/lemon_chicken_rice.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 100 },
            { name: "Full", price: 180 }
        ]
    },
    {
        id: "butter-garlic-fried-rice",
        name: "Butter Garlic Fried Rice",
        category: "Chinese Cuisine",
        description: "Rice stir-fried with butter, fresh garlic and aromatic seasonings.",
        image: "/dishes/butter_garlic_rice.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [
            { name: "Half", price: 100 },
            { name: "Full", price: 180 }
        ]
    },
    {
        id: "chicken-schezwan-fried-rice",
        name: "Chicken Schezwan Fried Rice",
        category: "Chinese Cuisine",
        description: "Spicy fried rice tossed with chicken and Schezwan sauce.",
        image: "/dishes/chicken_schezwan_rice.jpg",
        rating: 4.9,
        variants: [
            { name: "Half", price: 120 },
            { name: "Full", price: 200 }
        ]
    },

    // ----------------------------------------------------
    // PAGE 5: HAKKA NOODLES
    // ----------------------------------------------------
    {
        id: "chicken-hakka-noodles",
        name: "Chicken Hakka Noodles",
        category: "Chinese Cuisine",
        description: "Stir-fried noodles tossed with chicken, vegetables and Chinese sauces.",
        image: "/dishes/hakka_noodles.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [
            { name: "Half", price: 70 },
            { name: "Full", price: 130 }
        ]
    },
    {
        id: "veg-hakka-noodles",
        name: "Veg Hakka Noodles",
        category: "Chinese Cuisine",
        description: "Stir-fried noodles with fresh vegetables and aromatic seasonings.",
        image: "/dishes/veg_noodles.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [
            { name: "Half", price: 60 },
            { name: "Full", price: 100 }
        ]
    },
    {
        id: "lemon-chicken-hakka-noodles",
        name: "Lemon Chicken Hakka Noodles",
        category: "Chinese Cuisine",
        description: "Chicken noodles tossed with a refreshing lemon flavour.",
        image: "/dishes/lemon_chicken_noodles.jpg",
        rating: 4.8,
        variants: [
            { name: "Half", price: 100 },
            { name: "Full", price: 180 }
        ]
    },
    {
        id: "butter-garlic-hakka-noodles",
        name: "Butter Garlic Hakka Noodles",
        category: "Chinese Cuisine",
        description: "Noodles tossed in butter and fresh garlic.",
        image: "/dishes/butter_garlic_noodles.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [
            { name: "Half", price: 100 },
            { name: "Full", price: 180 }
        ]
    },
    {
        id: "chicken-schezwan-hakka-noodles",
        name: "Chicken Schezwan Hakka Noodles",
        category: "Chinese Cuisine",
        description: "Spicy noodles tossed with chicken and Schezwan flavours.",
        image: "/dishes/chicken_schezwan_noodles.jpg",
        rating: 4.9,
        variants: [
            { name: "Half", price: 120 },
            { name: "Full", price: 200 }
        ]
    },

    // ----------------------------------------------------
    // PAGE 5: PRAWN & SEAFOOD STARTERS
    // ----------------------------------------------------
    {
        id: "prawn-dry-fry",
        name: "Prawn Dry Fry",
        category: "Chinese Cuisine",
        description: "Juicy prawns fried with aromatic spices.",
        image: "/dishes/prawn_dry_fry.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 180 }]
    },
    {
        id: "chilli-prawn",
        name: "Chilli Prawn",
        category: "Chinese Cuisine",
        description: "Prawns tossed with green chillies, onions and spicy Chinese sauces.",
        image: "/dishes/chilli_prawn.jpg",
        rating: 4.9,
        variants: [{ name: "Standard", price: 200 }]
    },
    {
        id: "garlic-prawn",
        name: "Garlic Prawn",
        category: "Chinese Cuisine",
        description: "Prawns sautéed with fresh garlic and aromatic seasonings.",
        image: "/dishes/garlic_prawn.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 220 }]
    },
    {
        id: "prawn-salt-pepper",
        name: "Prawn Salt & Pepper",
        category: "Chinese Cuisine",
        description: "Prawns tossed with crushed black pepper and seasoning.",
        image: "/dishes/prawn_salt_pepper.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 230 }]
    },

    // ----------------------------------------------------
    // PAGE 6: MOMOS
    // ----------------------------------------------------
    {
        id: "chicken-steam-momo",
        name: "Chicken Steam Momo (6 Pcs)",
        category: "Momos",
        description: "Soft steamed dumplings filled with seasoned chicken.",
        image: "/dishes/chicken_momos.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "6 Pcs", price: 100 }]
    },
    {
        id: "afghani-momo",
        name: "Afghani Momo (6 Pcs)",
        category: "Momos",
        description: "Momos coated in a rich, creamy and mildly spiced Afghani sauce.",
        image: "/dishes/afghani_momo.jpg",
        rating: 4.9,
        variants: [{ name: "6 Pcs", price: 150 }]
    },
    {
        id: "pork-fried-momo",
        name: "Pork Fried Momo (6 Pcs)",
        category: "Momos",
        description: "Crispy fried dumplings filled with seasoned pork.",
        image: "/dishes/pork_fried_momo.jpg",
        rating: 4.8,
        variants: [{ name: "6 Pcs", price: 130 }]
    },
    {
        id: "cheese-momo",
        name: "Cheese Momo (6 Pcs)",
        category: "Momos",
        description: "Soft dumplings filled with creamy cheese.",
        image: "/dishes/cheese_momo.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "6 Pcs", price: 150 }]
    },
    {
        id: "butter-garlic-momo",
        name: "Butter Garlic Momo (6 Pcs)",
        category: "Momos",
        description: "Momos tossed in a rich butter and garlic preparation.",
        image: "/dishes/butter_garlic_momo.jpg",
        rating: 4.8,
        variants: [{ name: "6 Pcs", price: 140 }]
    },
    {
        id: "kurkure-momo",
        name: "Kurkure Momo (6 Pcs)",
        category: "Momos",
        description: "Extra-crispy momos with a crunchy outer coating.",
        image: "/dishes/kurkure_momo.jpg",
        rating: 4.9,
        variants: [{ name: "6 Pcs", price: 120 }]
    },
    {
        id: "pork-momo-8pcs",
        name: "Pork Momo (8 Pcs)",
        category: "Momos",
        description: "Traditional dumplings filled with minced pork.",
        image: "/dishes/pork_momo.jpg",
        rating: 4.9,
        variants: [{ name: "8 Pcs", price: 200 }]
    },

    // ----------------------------------------------------
    // PAGE 6: ROLLS, CHEESE SPECIALITIES & BURGERS
    // ----------------------------------------------------
    {
        id: "chicken-roll",
        name: "Chicken Roll",
        category: "Rolls & Burgers",
        description: "Soft roll filled with chicken, onions and sauces.",
        image: "/dishes/chicken_kathi_roll.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "chicken-butter-masala-roll",
        name: "Chicken Butter Masala Roll",
        category: "Rolls & Burgers",
        description: "A roll stuffed with creamy butter masala chicken.",
        image: "/dishes/chicken_butter_masala_roll.jpg",
        rating: 4.9,
        variants: [{ name: "Standard", price: 180 }]
    },
    {
        id: "jumbo-roll",
        name: "Jumbo Roll",
        category: "Rolls & Burgers",
        description: "A generously stuffed jumbo-sized roll.",
        image: "/dishes/jumbo_roll.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 200 }]
    },
    {
        id: "pork-roll",
        name: "Pork Roll",
        category: "Rolls & Burgers",
        description: "A flavourful roll filled with seasoned pork, onions and sauces.",
        image: "/dishes/pork_roll.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 150 }]
    },
    {
        id: "cheese-balls",
        name: "Cheese Balls (8 Pcs)",
        category: "Rolls & Burgers",
        description: "Crispy golden balls filled with melted cheese.",
        image: "/dishes/cheese_balls.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "8 Pcs", price: 180 }]
    },
    {
        id: "veg-cheese-corn-balls",
        name: "Veg Cheese Corn Balls (8 Pcs)",
        category: "Rolls & Burgers",
        description: "Crunchy bites stuffed with vegetables, sweet corn and cheese.",
        image: "/dishes/veg_cheese_corn_balls.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "8 Pcs", price: 200 }]
    },
    {
        id: "cheese-corn-fingers",
        name: "Cheese Corn Fingers (8 Pcs)",
        category: "Rolls & Burgers",
        description: "Crispy finger-shaped snacks filled with cheese and sweet corn.",
        image: "/dishes/cheese_corn_fingers.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "8 Pcs", price: 220 }]
    },
    {
        id: "chicken-burger",
        name: "Chicken Burger",
        category: "Rolls & Burgers",
        description: "Soft bun filled with a chicken patty, fresh vegetables and sauces.",
        image: "/dishes/chicken_burger.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 130 }]
    },
    {
        id: "veg-burger",
        name: "Veg Burger",
        category: "Rolls & Burgers",
        description: "Burger bun layered with a crispy vegetable patty, fresh vegetables and sauces.",
        image: "/dishes/veg_burger.jpg",
        rating: 4.6,
        isVeg: true,
        variants: [{ name: "Standard", price: 100 }]
    },

    // ----------------------------------------------------
    // PAGE 7: KOREAN CUISINE
    // ----------------------------------------------------
    {
        id: "chicken-kimbap",
        name: "Chicken Kimbap",
        category: "Korean Cuisine",
        description: "Korean-style rice rolls filled with chicken and fresh ingredients, wrapped in seaweed.",
        image: "/dishes/chicken_kimbap.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "Standard", price: 300 }]
    },
    {
        id: "prawn-kimbap",
        name: "Prawn Kimbap",
        category: "Korean Cuisine",
        description: "Korean-style rice rolls filled with prawns and fresh ingredients.",
        image: "/dishes/prawn_kimbap.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 340 }]
    },
    {
        id: "pork-kimbap",
        name: "Pork Kimbap",
        category: "Korean Cuisine",
        description: "Korean rice rolls filled with seasoned pork and fresh ingredients.",
        image: "/dishes/pork_kimbap.jpg",
        rating: 4.9,
        variants: [{ name: "Standard", price: 350 }]
    },
    {
        id: "kimchi",
        name: "Kimchi",
        category: "Korean Cuisine",
        description: "Traditional Korean fermented cabbage with spicy, tangy seasoning.",
        image: "/dishes/kimchi.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 100 }]
    },
    {
        id: "korean-fried-wings",
        name: "Korean Fried Wings (6 Pcs)",
        category: "Korean Cuisine",
        description: "Crispy chicken wings coated in a Korean-style sauce.",
        image: "/dishes/korean_fried_wings.jpg",
        rating: 4.9,
        variants: [{ name: "6 Pcs", price: 250 }]
    },
    {
        id: "kimchi-fried-rice",
        name: "Kimchi Fried Rice",
        category: "Korean Cuisine",
        description: "Korean-style fried rice tossed with tangy, spicy kimchi.",
        image: "/dishes/kimchi_fried_rice.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 200 }]
    },
    {
        id: "kimchi-hakka-noodles",
        name: "Kimchi Hakka Noodles",
        category: "Korean Cuisine",
        description: "Stir-fried noodles tossed with spicy kimchi.",
        image: "/dishes/kimchi_hakka_noodles.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 200 }]
    },
    {
        id: "pork-ramen",
        name: "Pork Ramen",
        category: "Korean Cuisine",
        description: "Ramen noodles served with flavourful pork and rich broth.",
        image: "/dishes/pork_ramen.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "Standard", price: 350 }]
    },
    {
        id: "chicken-ramen",
        name: "Chicken Ramen",
        category: "Korean Cuisine",
        description: "Ramen noodles served in a warm, flavourful chicken broth.",
        image: "/dishes/chicken_ramen.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 320 }]
    },
    {
        id: "prawn-ramen",
        name: "Prawn Ramen",
        category: "Korean Cuisine",
        description: "Ramen bowl prepared with prawns and aromatic broth.",
        image: "/dishes/prawn_ramen.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 340 }]
    },

    // ----------------------------------------------------
    // PAGE 7: LOCAL SPECIALITIES - AUTHENTIC NORTHEAST FLAVOURS
    // ----------------------------------------------------
    {
        id: "duck-curry",
        name: "Duck Curry",
        category: "Local Specialities",
        description: "Traditional duck curry slow-cooked with aromatic local spices.",
        image: "/dishes/duck_curry.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "Standard", price: 500 }]
    },
    {
        id: "duck-dry-fry",
        name: "Duck Dry Fry",
        category: "Local Specialities",
        description: "Duck pieces cooked and fried with traditional spices.",
        image: "/dishes/duck_dry_fry.jpg",
        rating: 4.9,
        variants: [{ name: "Standard", price: 390 }]
    },
    {
        id: "local-chicken-curry",
        name: "Local Chicken Curry",
        category: "Local Specialities",
        description: "Country chicken cooked in an authentic local-style curry.",
        image: "/dishes/local_chicken_curry.jpg",
        rating: 4.9,
        variants: [{ name: "Standard", price: 300 }]
    },
    {
        id: "local-chicken-dry-fry",
        name: "Local Chicken Dry Fry",
        category: "Local Specialities",
        description: "Country chicken fried with traditional spices.",
        image: "/dishes/local_chicken_dry_fry.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 290 }]
    },
    {
        id: "local-chicken-boil",
        name: "Local Chicken Boil",
        category: "Local Specialities",
        description: "Country chicken prepared in a traditional boiled preparation.",
        image: "/dishes/local_chicken_boil.jpg",
        rating: 4.7,
        variants: [{ name: "Standard", price: 350 }]
    },
    {
        id: "pork-boil-bamboo-shoots",
        name: "Pork Boil with Bamboo Shoots",
        category: "Local Specialities",
        description: "Traditional pork preparation cooked with bamboo shoots for an authentic Northeast flavour.",
        image: "/dishes/pork_boil_bamboo.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "Standard", price: 380 }]
    },

    // ----------------------------------------------------
    // PAGE 8 & 9: BEVERAGES (MOJITOS, SHAKES, COFFEE, TEA)
    // ----------------------------------------------------
    {
        id: "virgin-mojito",
        name: "Virgin Mojito",
        category: "Beverages",
        description: "A refreshing blend of mint, lemon, lime and sparkling soda.",
        image: "/dishes/virgin_mojito.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 90 }]
    },
    {
        id: "kiwi-mojito",
        name: "Kiwi Mojito",
        category: "Beverages",
        description: "A kiwi-flavoured cooler with mint and lime.",
        image: "/dishes/kiwi_mojito.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 90 }]
    },
    {
        id: "mango-mojito",
        name: "Mango Mojito",
        category: "Beverages",
        description: "A tropical mango refresher blended with mint and citrus.",
        image: "/dishes/mango_mojito.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 90 }]
    },
    {
        id: "pineapple-mojito",
        name: "Pineapple Mojito",
        category: "Beverages",
        description: "A pineapple drink with mint and a tangy citrus twist.",
        image: "/dishes/pineapple_mojito.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 90 }]
    },
    {
        id: "strawberry-mojito",
        name: "Strawberry Mojito",
        category: "Beverages",
        description: "A fruity strawberry cooler blended with mint and lime.",
        image: "/dishes/strawberry_mojito.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 90 }]
    },
    {
        id: "mango-shake",
        name: "Mango Shake",
        category: "Beverages",
        description: "A smooth and creamy milkshake with mango flavour.",
        image: "/dishes/mango_shake.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "strawberry-shake",
        name: "Strawberry Shake",
        category: "Beverages",
        description: "A creamy milkshake with sweet strawberry flavour.",
        image: "/dishes/strawberry_shake.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "chocolate-shake",
        name: "Chocolate Shake",
        category: "Beverages",
        description: "A rich and creamy chocolate milkshake.",
        image: "/dishes/chocolate_shake.jpg",
        rating: 4.9,
        isVeg: true,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "kitkat-shake",
        name: "KitKat Shake",
        category: "Beverages",
        description: "A chocolate milkshake blended with KitKat.",
        image: "/dishes/kitkat_shake.jpg",
        rating: 4.9,
        isVeg: true,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "oreo-shake",
        name: "Oreo Shake",
        category: "Beverages",
        description: "A creamy milkshake blended with Oreo cookies.",
        image: "/dishes/oreo_shake.jpg",
        rating: 4.9,
        isVeg: true,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "cappuccino",
        name: "Cappuccino",
        category: "Beverages",
        description: "Espresso topped with steamed milk and a smooth layer of foam.",
        image: "/dishes/cappuccino.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 80 }]
    },
    {
        id: "americano",
        name: "Americano",
        category: "Beverages",
        description: "A classic espresso-based coffee diluted with hot water.",
        image: "/dishes/americano.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 90 }]
    },
    {
        id: "iced-coffee",
        name: "Iced Coffee",
        category: "Beverages",
        description: "Chilled coffee served over ice.",
        image: "/dishes/iced_coffee.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 60 }]
    },
    {
        id: "cold-coffee-ice-cream",
        name: "Cold Coffee with Ice Cream",
        category: "Beverages",
        description: "Creamy chilled coffee topped with a scoop of ice cream.",
        image: "/dishes/cold_coffee_ice_cream.jpg",
        rating: 4.9,
        isVeg: true,
        variants: [{ name: "Standard", price: 130 }]
    },
    {
        id: "coffee-red-bull",
        name: "Coffee with Red Bull",
        category: "Beverages",
        description: "A distinctive coffee and Red Bull beverage.",
        image: "/dishes/coffee_red_bull.jpg",
        rating: 4.6,
        isVeg: true,
        variants: [{ name: "Standard", price: 50 }]
    },
    {
        id: "milk-tea",
        name: "Milk Tea",
        category: "Beverages",
        description: "Classic Indian tea brewed with milk and aromatic tea leaves.",
        image: "/dishes/milk_tea.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 30 }]
    },
    {
        id: "ginger-tea",
        name: "Ginger Tea",
        category: "Beverages",
        description: "Refreshing tea infused with fresh ginger.",
        image: "/dishes/ginger_tea.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 20 }]
    },
    {
        id: "green-tea",
        name: "Green Tea",
        category: "Beverages",
        description: "A light and refreshing cup of green tea.",
        image: "/dishes/green_tea.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 30 }]
    },
    {
        id: "black-tea",
        name: "Black Tea",
        category: "Beverages",
        description: "Traditional tea brewed without milk for a bold flavour.",
        image: "/dishes/black_tea.jpg",
        rating: 4.6,
        isVeg: true,
        variants: [{ name: "Standard", price: 20 }]
    },
    {
        id: "boba-tea",
        name: "Boba Tea",
        category: "Beverages",
        description: "A tea-based drink served with chewy tapioca pearls.",
        image: "/dishes/boba_tea.jpg",
        rating: 4.9,
        isVeg: true,
        variants: [{ name: "Standard", price: 150 }]
    },
    {
        id: "iced-tea",
        name: "Iced Tea",
        category: "Beverages",
        description: "Chilled tea served with ice.",
        image: "/dishes/iced_tea.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 50 }]
    },
    {
        id: "lemon-tea",
        name: "Lemon Tea",
        category: "Beverages",
        description: "Refreshing tea infused with fresh lemon.",
        image: "/dishes/lemon_tea.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 30 }]
    },

    // ----------------------------------------------------
    // PAGE 10: HEALTHY CORNER
    // ----------------------------------------------------
    {
        id: "dahi-oats",
        name: "Dahi Oats",
        category: "Healthy Corner",
        description: "Oats mixed with fresh curd for a light and refreshing meal.",
        image: "/dishes/dahi_oats.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 150 }]
    },
    {
        id: "fruit-oats",
        name: "Fruit Oats",
        category: "Healthy Corner",
        description: "Oats combined with fresh seasonal fruits.",
        image: "/dishes/fruit_oats.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 200 }]
    },
    {
        id: "chicken-omelette",
        name: "Chicken Omelette",
        category: "Healthy Corner",
        description: "An omelette prepared with eggs and seasoned chicken filling.",
        image: "/dishes/chicken_omelette.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 120 }]
    },
    {
        id: "oats-omelette",
        name: "Oats Omelette",
        category: "Healthy Corner",
        description: "A wholesome omelette prepared with oats and eggs.",
        image: "/dishes/oats_omelette.jpg",
        rating: 4.7,
        variants: [{ name: "Standard", price: 150 }]
    },
    {
        id: "boiled-egg",
        name: "Boiled Egg",
        category: "Healthy Corner",
        description: "A freshly boiled egg, simply prepared.",
        image: "/dishes/boiled_egg.jpg",
        rating: 4.6,
        variants: [{ name: "1 Pc", price: 20 }]
    },
    {
        id: "chicken-salad",
        name: "Chicken Salad",
        category: "Healthy Corner",
        description: "Fresh vegetables tossed with seasoned chicken.",
        image: "/dishes/chicken_salad.jpg",
        rating: 4.8,
        variants: [{ name: "Standard", price: 180 }]
    },
    {
        id: "banana-shake",
        name: "Banana Shake",
        category: "Healthy Corner",
        description: "A smooth and creamy shake made with bananas and milk.",
        image: "/dishes/banana_shake.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 100 }]
    },
    {
        id: "fruit-salad",
        name: "Fruit Salad",
        category: "Healthy Corner",
        description: "A refreshing bowl of freshly cut seasonal fruits.",
        image: "/dishes/fruit_salad.jpg",
        rating: 4.8,
        isVeg: true,
        variants: [{ name: "Standard", price: 250 }]
    },
    {
        id: "russian-salad",
        name: "Russian Salad",
        category: "Healthy Corner",
        description: "A creamy salad prepared with vegetables and dressing.",
        image: "/dishes/russian_salad.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "Standard", price: 300 }]
    },

    // ----------------------------------------------------
    // PAGE 10: MANCHURIAN
    // ----------------------------------------------------
    {
        id: "chicken-manchurian",
        name: "Chicken Manchurian (8 Pcs)",
        category: "Manchurian",
        description: "Chicken balls tossed in a spicy Indo-Chinese Manchurian sauce.",
        image: "/dishes/chicken_manchurian.jpg",
        rating: 4.9,
        isChefSpecial: true,
        variants: [{ name: "8 Pcs", price: 180 }]
    },
    {
        id: "veg-manchurian",
        name: "Veg Manchurian (8 Pcs)",
        category: "Manchurian",
        description: "Vegetable balls tossed in a flavourful Manchurian sauce.",
        image: "/dishes/veg_manchurian.jpg",
        rating: 4.7,
        isVeg: true,
        variants: [{ name: "8 Pcs", price: 130 }]
    }
];
