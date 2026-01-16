export const filterReducer = (state, action) => {
    const {type, payload} = action;

    switch(type) {
        
        case "PRODUCT_LIST":
            return {...state, productList: payload.products}

        case "PRICE":
            return {...state, minPrice: payload.minPrice, maxPrice: payload.maxPrice};

        case "MAIN_CATEGORY": {
            const clicked = payload.mainCategory;
            const alreadySelected = state.mainCategory.includes(clicked);

            let updatedMainCategory;

            if (alreadySelected) {
                updatedMainCategory = state.mainCategory.filter(c => c !== clicked);
            } else {
                updatedMainCategory = [...state.mainCategory, clicked];
            }

            return {...state, mainCategory: updatedMainCategory, subCategory: null, filterCategory: null};
        }

        case "SUB_CATEGORY": {
            const clickedSub = payload.subCategory?.toLowerCase();
            if (!clickedSub) return state;

            const existing = state.subCategory || [];   // fallback to empty array
            const alreadySelected = existing.includes(clickedSub);

            const updatedSubCategory = alreadySelected
                ? existing.filter(s => s !== clickedSub)
                : [...existing, clickedSub];

            return {
                ...state,
                subCategory: updatedSubCategory,
                filterCategory: null
            };
        }

        case "FILTER_CATEGORY": {
            const clicked = payload.filterCategory;
            const existing = state.filterCategory || [];
            const already = existing.includes(clicked);

            const updated = already
                ? existing.filter(f => f !== clicked)
                : [...existing, clicked];

            return {
                ...state,
                filterCategory: updated
            };
        }

        case "FILTER_CATEGORY_NAME":
            return {
                ...state,
                filterCategoryName: state.filterCategoryName.includes(action.payload)
                ? state.filterCategoryName.filter(item => item !== action.payload)
                : [...state.filterCategoryName, action.payload],
            };

        case "COLOR": {
            const clickedColor = payload.color;
            if (!clickedColor) return state;

            const existing = Array.isArray(state.color) ? state.color : [];
            const alreadySelected = existing.includes(clickedColor);

            const updatedColor = alreadySelected
                ? existing.filter(c => c !== clickedColor)
                : [...existing, clickedColor];

            return {
                ...state,
                color: updatedColor
            };
        }

        case "MATERIAL": {
            const clickedMaterial = payload.material;
            if (!clickedMaterial) return state;

            const existing = Array.isArray(state.material) ? state.material : [];
            const alreadySelected = existing.includes(clickedMaterial);

            const updatedMaterial = alreadySelected
                ? existing.filter(m => m !== clickedMaterial)
                : [...existing, clickedMaterial];

            return {
                ...state,
                material: updatedMaterial
            };
        }

        case "DESIGNER": {
            const clickedDesigner = payload.designer;
            if (!clickedDesigner) return state;

            const existing = Array.isArray(state.designer) ? state.designer : [];
            const alreadySelected = existing.includes(clickedDesigner);

            const updatedDesigner = alreadySelected
                ? existing.filter(d => d !== clickedDesigner)
                : [...existing, clickedDesigner];

            return {
                ...state,
                designer: updatedDesigner
            };
        }

        case "PLUS_SIZE": {
            const clickedSize = payload.plusSize?.toLowerCase();
            if (!clickedSize) return state;

            const existing = Array.isArray(state.plusSize) ? state.plusSize : [];
            const alreadySelected = existing.includes(clickedSize);

            const updatedPlusSize = alreadySelected
                ? existing.filter(s => s !== clickedSize)
                : [...existing, clickedSize];

            return {
                ...state,
                plusSize: updatedPlusSize
            };
        }

        case "OCCASION": {
            const clickedOccasion = payload.occasion?.toLowerCase();
            if (!clickedOccasion) return state;

            const existing = Array.isArray(state.occasion) ? state.occasion : [];
            const alreadySelected = existing.includes(clickedOccasion);

            const updatedOccasion = alreadySelected
                ? existing.filter(o => o !== clickedOccasion)
                : [...existing, clickedOccasion];

            return {
                ...state,
                occasion: updatedOccasion
            };
        }

        case "SIZE": {
            const clickedSize = payload.size?.toLowerCase();
            if (!clickedSize) return state;

            const existing = Array.isArray(state.size) ? state.size : [];
            const alreadySelected = existing.includes(clickedSize);

            const updatedSize = alreadySelected
                ? existing.filter(s => s !== clickedSize)
                : [...existing, clickedSize];

            return {
                ...state,
                size: updatedSize
            };
        }

        case "CELEBRITY": {
            const clickedCelebrity = payload.celebrity?.toLowerCase();
            if (!clickedCelebrity) return state;

            const existing = Array.isArray(state.celebrity) ? state.celebrity : [];
            const alreadySelected = existing.includes(clickedCelebrity);

            const updatedCelebrity = alreadySelected
                ? existing.filter(s => s !== clickedCelebrity)
                : [...existing, clickedCelebrity];

            return {
                ...state,
                celebrity: updatedCelebrity
            };
        }

        case "SHIPPING_TIME": {
            const clickedShippingTime = payload.shippingTime?.toLowerCase();
            if (!clickedShippingTime) return state;

            const existing = Array.isArray(state.shippingTime) ? state.shippingTime : [];
            const alreadySelected = existing.includes(clickedShippingTime);

            const updatedShippingTime = alreadySelected
                ? existing.filter(s => s !== clickedShippingTime)
                : [...existing, clickedShippingTime];

            return {
                ...state,
                shippingTime: updatedShippingTime
            };
        }

        case "SORT_BY":
            return {...state, sortBy: payload.sortBy}

        case "NEW_ARRIVAL":
            return {...state, newIn: payload.newIn}

        case "READY_TO_SHIP":
            return {...state, readyToShip: payload.readyToShip}

        case "ON_SALE":
            return {...state, onSale: payload.onSale}

        case "CSTM_FIT":
            return {...state, cstmFit: payload.cstmFit}

        case "REST_FILTER":
            return {
                ...state,
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
            }

        default:
            throw new Error("No product found!");
    }
}