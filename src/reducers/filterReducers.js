export const filterReducer = (state, action) => {
    switch (action.type) {

        /* ---------------- PRODUCT LIST ---------------- */
        case "PRODUCT_LIST":
            return {
                ...state,
                productList: action.payload.products
            };

        /* ---------------- PRICE ---------------- */
        case "PRICE":
            return {
                ...state,
                minPrice: action.payload.minPrice,
                maxPrice: action.payload.maxPrice
            };

        /* ---------------- MAIN CATEGORY ---------------- */
        case "MAIN_CATEGORY":
            return {
                ...state,
                mainCategory: state.mainCategory.includes(action.payload.mainCategory)
                    ? state.mainCategory.filter(v => v !== action.payload.mainCategory)
                    : [...state.mainCategory, action.payload.mainCategory]
            };

        case "REMOVE_MAIN_CATEGORY":
            return {
                ...state,
                mainCategory: state.mainCategory.filter(v => v !== action.payload),
                subCategory: [],
                filterCategory: []
            };

        /* ---------------- SUB CATEGORY ---------------- */
        case "SUB_CATEGORY":
            return {
                ...state,
                subCategory: state.subCategory.includes(action.payload.subCategory)
                    ? state.subCategory.filter(v => v !== action.payload.subCategory)
                    : [...state.subCategory, action.payload.subCategory]
            };

        case "REMOVE_SUB_CATEGORY":
            return {
                ...state,
                subCategory: state.subCategory.filter(v => v !== action.payload),
                filterCategory: []
            };

        /* ---------------- FILTER CATEGORY ---------------- */
        case "FILTER_CATEGORY":
            return {
                ...state,
                filterCategory: state.filterCategory.includes(action.payload.filterCategory)
                    ? state.filterCategory.filter(v => v !== action.payload.filterCategory)
                    : [...state.filterCategory, action.payload.filterCategory]
            };

        case "REMOVE_FILTER_CATEGORY":
            return {
                ...state,
                filterCategory: state.filterCategory.filter(v => v !== action.payload)
            };

        /* ---------------- FILTER CATEGORY NAME ---------------- */
        case "FILTER_CATEGORY_NAME":
            return {
                ...state,
                filterCategoryName: state.filterCategoryName.includes(action.payload)
                    ? state.filterCategoryName.filter(v => v !== action.payload)
                    : [...state.filterCategoryName, action.payload]
            };

        /* ---------------- COLOR ---------------- */
        case "COLOR":
            return {
                ...state,
                color: state.color.includes(action.payload.color)
                    ? state.color.filter(v => v !== action.payload.color)
                    : [...state.color, action.payload.color]
            };

        case "REMOVE_COLOR":
            return {
                ...state,
                color: state.color.filter(v => v !== action.payload)
            };

        /* ---------------- MATERIAL ---------------- */
        case "MATERIAL":
            return {
                ...state,
                material: state.material.includes(action.payload.material)
                    ? state.material.filter(v => v !== action.payload.material)
                    : [...state.material, action.payload.material]
            };

        case "REMOVE_MATERIAL":
            return {
                ...state,
                material: state.material.filter(v => v !== action.payload)
            };

        /* ---------------- DESIGNER ---------------- */
        case "DESIGNER":
            return {
                ...state,
                designer: state.designer.includes(action.payload.designer)
                    ? state.designer.filter(v => v !== action.payload.designer)
                    : [...state.designer, action.payload.designer]
            };

        case "REMOVE_DESIGNER":
            return {
                ...state,
                designer: state.designer.filter(v => v !== action.payload)
            };

        /* ---------------- PLUS SIZE ---------------- */
        case "PLUS_SIZE":
            return {
                ...state,
                plusSize: state.plusSize.includes(action.payload.plusSize)
                    ? state.plusSize.filter(v => v !== action.payload.plusSize)
                    : [...state.plusSize, action.payload.plusSize]
            };

        case "REMOVE_PLUS_SIZE":
            return {
                ...state,
                plusSize: state.plusSize.filter(v => v !== action.payload)
            };

        /* ---------------- OCCASION ---------------- */
        case "OCCASION":
            return {
                ...state,
                occasion: state.occasion.includes(action.payload.occasion)
                    ? state.occasion.filter(v => v !== action.payload.occasion)
                    : [...state.occasion, action.payload.occasion]
            };

        case "REMOVE_OCCASION":
            return {
                ...state,
                occasion: state.occasion.filter(v => v !== action.payload)
            };

        /* ---------------- SIZE ---------------- */
        case "SIZE":
            return {
                ...state,
                size: state.size.includes(action.payload.size)
                    ? state.size.filter(v => v !== action.payload.size)
                    : [...state.size, action.payload.size]
            };

        case "REMOVE_SIZE":
            return {
                ...state,
                size: state.size.filter(v => v !== action.payload)
            };

        /* ---------------- CELEBRITY ---------------- */
        case "CELEBRITY":
            return {
                ...state,
                celebrity: state.celebrity.includes(action.payload.celebrity)
                    ? state.celebrity.filter(v => v !== action.payload.celebrity)
                    : [...state.celebrity, action.payload.celebrity]
            };

        case "REMOVE_CELEBRITY":
            return {
                ...state,
                celebrity: state.celebrity.filter(v => v !== action.payload)
            };

        /* ---------------- SHIPPING TIME ---------------- */
        case "SHIPPING_TIME":
            return {
                ...state,
                shippingTime: state.shippingTime.includes(action.payload.shippingTime)
                    ? state.shippingTime.filter(v => v !== action.payload.shippingTime)
                    : [...state.shippingTime, action.payload.shippingTime]
            };

        case "REMOVE_SHIPPING_TIME":
            return {
                ...state,
                shippingTime: state.shippingTime.filter(v => v !== action.payload)
            };

        /* ---------------- SORT ---------------- */
        case "SORT_BY":
            return {
                ...state,
                sortBy: action.payload.sortBy
            };

        /* ---------------- FLAGS ---------------- */
        case "NEW_ARRIVAL":
            return { ...state, newIn: action.payload.newIn };

        case "READY_TO_SHIP":
            return { ...state, readyToShip: action.payload.readyToShip };

        case "CSTM_FIT":
            return { ...state, cstmFit: action.payload.cstmFit };

        case "ON_SALE":
            return { ...state, onSale: action.payload.onSale };

        /* ---------------- RESET ---------------- */
        case "REST_FILTER":
            return {
                ...state,
                minPrice: 0,
                maxPrice: 1000000,
                mainCategory: [],
                subCategory: [],
                filterCategory: [],
                filterCategoryName: [],
                color: [],
                material: [],
                designer: [],
                plusSize: [],
                occasion: [],
                size: [],
                celebrity: [],
                shippingTime: [],
                sortBy: null,
                newIn: false,
                readyToShip: null,
                onSale: false,
                cstmFit: false
            };

        default:
            throw new Error("No product found!");
    }
};
