import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { filterReducer } from "../reducers/filterReducers";

const filterInitialState = {
    productList: [],
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
}


const FilterContext = createContext(filterInitialState);

export const FilterProvider = ({ children }) => {
    const [state, dispatch] = useReducer(filterReducer, filterInitialState);
    const navigate = useNavigate();
    const location = useLocation();    



    function updateURLWithFilters(newState) {
        const searchParams = new URLSearchParams();

        if (newState.mainCategory.length) searchParams.set("main", newState.mainCategory.join(","));
        // CHANGE: Use subpaths and filterpaths for hierarchical support
        if (newState.subCategory.length) searchParams.set("subpaths", newState.subCategory.join(","));
        if (newState.filterCategory.length) searchParams.set("filterpaths", newState.filterCategory.join(","));
        
        // filterCategoryName stays flat
        if (newState.filterCategoryName.length) searchParams.set("filter", newState.filterCategoryName.join(","));
        
        // Other filters unchanged...
        if (newState.color.length) searchParams.set("color", newState.color.join(","));
        // ... rest unchanged

        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }


    function restoreFiltersFromURL() {
        const params = new URLSearchParams(location.search);

        const newState = {
            ...state,
            mainCategory: params.get("main")?.split(",") || [],
            // CHANGE: Parse hierarchical paths
            subCategory: params.get("subpaths")?.split(",") || [],
            filterCategory: params.get("filterpaths")?.split(",") || [],
            filterCategoryName: params.get("filter")?.split(",") || [],
            // ... rest unchanged
        };

        dispatch({ type: "RESTORE_FROM_URL", payload: newState });
    }

    useEffect(() => {
        restoreFiltersFromURL();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    //productlist

    function initialProductList(products) {
        dispatch({
            type: "PRODUCT_LIST",
            payload: {
                products: products
            }
        })
    }


    //price

    function setPrice(min, max) {
        const newState = { ...state, minPrice: min, maxPrice: max };
        dispatch({ type: "PRICE", payload: { minPrice: min, maxPrice: max } });
        updateURLWithFilters(newState);
    }

    function filterPrice(products) {
        return products.filter(product => {
            const price = Number(product?.selling_price || 0);
            return price >= state.minPrice && price <= state.maxPrice;
        });
    }


    //main category

    function setMainCategory(mainCategory) {
        const newState = {
            ...state,
            mainCategory: state.mainCategory.includes(mainCategory)
                ? state.mainCategory.filter(v => v !== mainCategory)
                : [...state.mainCategory, mainCategory]
        };

        dispatch({
            type: "MAIN_CATEGORY",
            payload: { mainCategory }
        });
        
        updateURLWithFilters(newState);
    }

    function filterMainCategory(products) {
        if (!state.mainCategory || state.mainCategory.length === 0) {
            return products;
        }

        return products.filter(product => {
            const productCategory = product?.product_category?.toLowerCase();
            return state.mainCategory.includes(productCategory);
        });
    }


    //sub category

    function setSubCategory(mainCategory, subCategoryName) {
        if (!mainCategory || !subCategoryName) return;

        // BUILD FULL PATH: "women/kurta-sets"
        const subPath = `${mainCategory}/${subCategoryName}`.toLowerCase().replace(/ /g, '-');
        
        const newState = {
            ...state,
            subCategory: state.subCategory.includes(subPath)
                ? state.subCategory.filter(v => v !== subPath)
                : [...state.subCategory, subPath]
        };

        dispatch({
            type: "SUB_CATEGORY",
            payload: { subPath }  // Pass full path to reducer
        });

        updateURLWithFilters(newState);
    }

    function filterSubCategory(products) {
        const selectedSubs = state.subCategory || [];
        if (!selectedSubs.length) return products;

        return products.filter(product => {
            const mainCat = product.product_category?.toLowerCase().trim();
            const subCat = product.product_sub_category?.toLowerCase().trim();
            if (!mainCat || !subCat) return false;
            
            const productSubPath = `${mainCat}/${subCat}`;
            return selectedSubs.includes(productSubPath);
        });
    }





    //filter category

    function setFilterCategory(mainCategory, subCategoryName, filterCategoryName) {
        if (!mainCategory || !subCategoryName || !filterCategoryName) return;

        // BUILD FULL PATH: "women/kurta-sets/printed-kurta-sets"
        const filterPath = `${mainCategory}/${subCategoryName}/${filterCategoryName}`.toLowerCase().replace(/ /g, '-');
        
        dispatch({
            type: "FILTER_CATEGORY",
            payload: { filterPath }  // Pass full path to reducer
        });
        
        // Update URL after dispatch
        const newState = {
            ...state,
            filterCategory: state.filterCategory.includes(filterPath)
                ? state.filterCategory.filter(v => v !== filterPath)
                : [...state.filterCategory, filterPath]
        };
        updateURLWithFilters(newState);
    }

    function filterFilterCategory(products) {
        const selectedFilters = state.filterCategory || [];
        if (!selectedFilters.length) return products;

        return products.filter(product => {
            const mainCat = product.product_category?.toLowerCase().trim();
            const subCat = product.product_sub_category?.toLowerCase().trim();
            const filterCat = product.filter_categories?.toLowerCase().trim();
            
            if (!mainCat || !subCat || !filterCat) return false;
            
            const productFilterPath = `${mainCat}/${subCat}/${filterCat}`;
            return selectedFilters.includes(productFilterPath);
        });
    }



    //filter category name

    function setFilterCategoryName(filterCategoryName) {
        dispatch({
            type: "FILTER_CATEGORY_NAME",
            payload: filterCategoryName.toLowerCase()
        });
    }

    function filterFilterCategoryName(products) {
        if (!state.filterCategoryName.length) {
            return products;
        }

        return products.filter(product => {
            const productCategories = product?.filter_categories;

            if (!productCategories) return false;

            if (typeof productCategories === "string") {
                return productCategories
                    .toLowerCase()
                    .split(",")
                    .map(v => v.trim())
                    .some(cat => state.filterCategoryName.includes(cat));
            }

            if (Array.isArray(productCategories)) {
                return productCategories
                    .map(v => v.toLowerCase())
                    .some(cat => state.filterCategoryName.includes(cat));
            }

            return false;
        });
    }




    //color

    function setColor(color) {
        if (!color) return;

        const newState = {
            ...state,
            color: state.color.includes(color)
                ? state.color.filter(v => v !== color)
                : [...state.color, color]
        };

        dispatch({
            type: "COLOR",
            payload: { color }
        });

        updateURLWithFilters(newState);
    }

    function filterColor(products) {
        const selectedColors = state.color || [];
        return selectedColors.length ? products.filter(product => selectedColors.includes(product.color?.toLowerCase())) : products;
    }


    //material

    function setMaterial(material) {
        if (!material) return;

        const newState = {
            ...state,
            material: state.material.includes(material)
                ? state.material.filter(v => v !== material)
                : [...state.material, material]
        };

        dispatch({ type: "MATERIAL", payload: { material } });
        updateURLWithFilters(newState);
    }

    function filterMaterial(products) {
        const selectedMaterials = state.material || [];
        return selectedMaterials.length ? products.filter(product => selectedMaterials.includes(product.fabric?.toLowerCase().trim())) : products;
    }



    //designer

    function setDesigner(designer) {
        if (!designer) return;

        const newState = {
            ...state,
            designer: state.designer.includes(designer)
                ? state.designer.filter(v => v !== designer)
                : [...state.designer, designer]
        };

        dispatch({ type: "DESIGNER", payload: { designer } });
        updateURLWithFilters(newState);
    }

    function filterDesigner(products) {
        const selectedDesigners = state.designer || [];
        return selectedDesigners.length ? products.filter(product => selectedDesigners.includes(product.designer?.toLowerCase())) : products;
    }


    //plus size

    function setPlusSize(plusSize) {
        if (!plusSize) return;

        const newState = {
            ...state,
            plusSize: state.plusSize.includes(plusSize)
                ? state.plusSize.filter(v => v !== plusSize)
                : [...state.plusSize, plusSize]
        };

        dispatch({ type: "PLUS_SIZE", payload: { plusSize } });
        updateURLWithFilters(newState);
    }

    function filterPlusSize(products) {
        const selectedSizes = state.plusSize || [];
        if (!selectedSizes.length) return products;

        return products.filter(product => {
            const sizes = product.product_plus_size;

            if (Array.isArray(sizes)) {
                return selectedSizes.some(size => sizes.map(s => s.toLowerCase()).includes(size));
            }

            if (typeof sizes === "string") {
                const sizeArray = sizes.split(",").map(s => s.trim().toLowerCase());
                return selectedSizes.some(size => sizeArray.includes(size));
            }

            return false;
        });
    }



    //occasion

    function setOccasion(occasion) {
        if (!occasion) return;

        const newState = {
            ...state,
            occasion: state.occasion.includes(occasion)
                ? state.occasion.filter(v => v !== occasion)
                : [...state.occasion, occasion]
        };

        dispatch({ type: "OCCASION", payload: { occasion } });
        updateURLWithFilters(newState);
    }


    function filterOccasion(products) {
        const selectedOccasions = state.occasion || [];
        if (!selectedOccasions.length) return products;

        return products.filter(product => {
            const productOccasion = product.occasion?.toLowerCase();
            return selectedOccasions.includes(productOccasion);
        });
    }



    //size

    function setSize(size) {
        if (!size) return;

        const newState = {
            ...state,
            size: state.size.includes(size)
                ? state.size.filter(v => v !== size)
                : [...state.size, size]
        };

        dispatch({ type: "SIZE", payload: { size } });
        updateURLWithFilters(newState);
    }

    function filterSize(products) {
        const selectedSizes = state.size || [];
        if (!selectedSizes.length) return products;

        return products.filter(product => {
            const productSizes = product?.product_size?.split(",").map(s => s.trim().toLowerCase()) || [];
            return selectedSizes.some(size => productSizes.includes(size));
        });
    }



    //celebrity

    function setCelebrity(celebrity) {
        if (!celebrity) return;

        const newState = {
            ...state,
            celebrity: state.celebrity.includes(celebrity)
                ? state.celebrity.filter(v => v !== celebrity)
                : [...state.celebrity, celebrity]
        };

        dispatch({ type: "CELEBRITY", payload: { celebrity } });
        updateURLWithFilters(newState);
    }

    function filterCelebrity(products) {
        const selectedCelebrities = state.celebrity || [];
        if (!selectedCelebrities.length) return products;

        return products.filter(product => {
            const productCelebrity = product.celebrity?.toLowerCase();
            return selectedCelebrities.includes(productCelebrity);
        });
    }



    //shipping time

    function setShippingTime(shippingTime) {
        if (!shippingTime) return;

        const newState = {
            ...state,
            shippingTime: state.shippingTime.includes(shippingTime)
                ? state.shippingTime.filter(v => v !== shippingTime)
                : [...state.shippingTime, shippingTime]
        };

        dispatch({ type: "SHIPPING_TIME", payload: { shippingTime } });
        updateURLWithFilters(newState);
    }

    function filterShippingTime(products) {
        const selectedShippingTimes = state.shippingTime || [];
        if (!selectedShippingTimes.length) return products;

        return products.filter(product => {
            const productShippingTime = product.shippingTime?.toLowerCase();
            return selectedShippingTimes.includes(productShippingTime);
        });
    }



    //sortby

    function setSortBy(sortBy) {
        const newState = { ...state, sortBy };
        dispatch({ type: "SORT_BY", payload: { sortBy } });
        updateURLWithFilters(newState);
    }

    function filterSortBy(products) {
        if (state.sortBy === "LOW_TO_HIGH") {
            return products.sort((a, b) => a.selling_price - b.selling_price);
        } else if (state.sortBy === "HIGH_TO_LOW") {
            return products.sort((a, b) => b.selling_price - a.selling_price);
        } else if (state.sortBy === "NEW_ARRIVALS") {
            return products.filter(product => product.new_arrival === "1" || product?.new_arrival === true);
        } else if (state.sortBy === "BEST_SELLER") {
            return products.filter(product => product.best_seller === "1");
        } else if (state.sortBy === "DISCOUNT_HIGH_TO_LOW") {
            return products.sort((a, b) => b.discount - a.discount);
        } else {
            return products;
        }
    }

    // console.log(state.sortBy)



    //new arrival

    function setNewArrival(value) {
        const newState = { ...state, newIn: value };
        dispatch({ type: "NEW_ARRIVAL", payload: { newIn: value } });
        updateURLWithFilters(newState);
    }

    function filterNewArrival(products) {
        return state.newIn ? products.filter(product => product.new_arrival === "1" || product?.new_arrival === true) : products;
    }



    //ready to ship

    function setReadyToShip(value) {
        const newState = { ...state, readyToShip: value };
        dispatch({ type: "READY_TO_SHIP", payload: { readyToShip: value } });
        updateURLWithFilters(newState);
    }

    function filterReadyToShip(products) {
        return state.readyToShip ? products.filter(product => (product?.rts_quantity * 1) > 0) : products;
    }


    // custom fit

    function setCstmFit(value) {
        const newState = { ...state, cstmFit: value };
        dispatch({ type: "CSTM_FIT", payload: { cstmFit: value } });
        updateURLWithFilters(newState);
    }

    function filterCstmFit(products) {
        return state.cstmFit ? products.filter(product => product?.custom_fit?.toString().trim().toLowerCase() === "yes") : products;
    }


    //on sale

    function setOnSale(value) {
        const newState = { ...state, onSale: value };
        dispatch({ type: "ON_SALE", payload: { onSale: value } });
        updateURLWithFilters(newState);
    }

    function filterOnSale(products) {
        return state.onSale ? products.filter(product => product?.discount >= 17) : products;
    }


    //reset

    function resetFilter() {
        dispatch({
            type: "REST_FILTER"
        })
    }

    function removeMainCategory(value) {
        dispatch({ type: "REMOVE_MAIN_CATEGORY", payload: value });
    }

    function removeSubCategory(subPath) {
        dispatch({ type: "REMOVE_SUB_CATEGORY", payload: { subPath } });
    }

    function removeFilterCategory(filterPath) {
        dispatch({ type: "REMOVE_FILTER_CATEGORY", payload: { filterPath } });
    }

    function removeColor(value) {
        dispatch({ type: "REMOVE_COLOR", payload: value });
    }

    function removeMaterial(value) {
        dispatch({ type: "REMOVE_MATERIAL", payload: value });
    }

    function removeDesigner(value) {
        dispatch({ type: "REMOVE_DESIGNER", payload: value });
    }

    function removePlusSize(value) {
        dispatch({ type: "REMOVE_PLUS_SIZE", payload: value });
    }

    function removeOccasion(value) {
        dispatch({ type: "REMOVE_OCCASION", payload: value });
    }

    function removeSize(value) {
        dispatch({ type: "REMOVE_SIZE", payload: value });
    }

    function removeCelebrity(value) {
        dispatch({ type: "REMOVE_CELEBRITY", payload: value });
    }

    function removeShippingTime(value) {
        dispatch({ type: "REMOVE_SHIPPING_TIME", payload: value });
    }


    const filteredProducts = filterReadyToShip(
        filterNewArrival(
            filterOnSale(
                filterCstmFit(
                    filterSortBy(
                        filterShippingTime(
                            filterCelebrity(
                                filterSize(
                                    filterOccasion(
                                        filterPlusSize(
                                            filterDesigner(
                                                filterMaterial(
                                                    filterColor(
                                                        filterFilterCategoryName(
                                                            filterFilterCategory(
                                                                filterSubCategory(
                                                                    filterMainCategory(
                                                                        filterPrice(state.productList)
                                                                    )
                                                                )
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    );



    const value = {
        products: filteredProducts,

        onSale: state.onSale,
        newIn: state.newIn,
        readyToShip: state.readyToShip,
        cstmFit: state.cstmFit,

        initialProductList,

        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        setPrice,

        mainCategory: state.mainCategory,
        setMainCategory,

        subCategory: state.subCategory,
        setSubCategory,

        filterCategoryCntxt: state.filterCategory,
        setFilterCategory,

        filterCategoryName: state.filterCategoryName,
        setFilterCategoryName,

        color: state.color,
        setColor,

        material: state.material,
        setMaterial,

        designer: state.designer,
        setDesigner,

        plusSize: state.plusSize,
        setPlusSize,

        occasion: state.occasion,
        setOccasion,

        size: state.size,
        setSize,

        celebrity: state.celebrity,
        setCelebrity,

        shippingTime: state.shippingTime,
        setShippingTime,

        sortBy: state.sortBy,
        setSortBy,

        setNewArrival,
        setReadyToShip,
        setCstmFit,
        setOnSale,

        // remove handlers
        removeMainCategory,
        removeSubCategory,
        removeFilterCategory,
        removeColor,
        removeMaterial,
        removeDesigner,
        removePlusSize,
        removeOccasion,
        removeSize,
        removeCelebrity,
        removeShippingTime,

        resetFilter
        };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export const useFilter = () => {
    const context = useContext(FilterContext);

    return context;
}