import { createContext, useContext, useReducer } from "react";

import { filterReducer } from "../reducers/filterReducers";

const filterInitialState = {
    productList: [],
    minPrice: 0,
    maxPrice: 100000,
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

export const FilterProvider = ({children}) => {
    const [state, dispatch] = useReducer(filterReducer, filterInitialState);    


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
        dispatch({
            type: "PRICE",
            payload: { minPrice: min, maxPrice: max }
        });
    }

    function filterPrice(products) {
        return products.filter(product => {
            const price = Number(product?.selling_price || 0);
            return price >= state.minPrice && price <= state.maxPrice;
        });
    }
    

    //main category

    function setMainCategory(mainCategory) {
        dispatch({
            type: "MAIN_CATEGORY",
            payload: {
                mainCategory: mainCategory
            }
        })
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

    function setSubCategory(mainCategory, subCategory) {
        if (!subCategory) return;
        dispatch({
            type: "SUB_CATEGORY",
            payload: { mainCategory, subCategory }
        });
    }

    function filterSubCategory(products) {
        const selectedMain = state.mainCategory || [];
        const selectedSub = state.subCategory || [];

        return products.filter(product => {
            const mainCat = product.product_category?.toLowerCase().trim();
            const subCat = product.product_sub_category?.toLowerCase().trim();

            const mainMatch = selectedMain.length ? selectedMain.includes(mainCat) : true;
            const subMatch = selectedSub.length ? selectedSub.includes(subCat) : true;

            return mainMatch && subMatch;
        });
    }


    


    //filter category

    function setFilterCategory(mainCategory, subCategory, filterCategory) {
        if (!mainCategory || !subCategory || !filterCategory) return;

        dispatch({
            type: "FILTER_CATEGORY",
            payload: {
                filterCategory: filterCategory.toLowerCase(),
            }
        });
    }

    function filterFilterCategory(products) {
        const selectedFilters = state.filterCategory || [];
        const selectedMain = state.mainCategory || [];
        const selectedSub = state.subCategory || [];

        return products.filter(product => {
            const mainCat = product.product_category?.toLowerCase().trim();
            const subCat = product.product_sub_category?.toLowerCase().trim();
            const filterCat = product.filter_categories?.toLowerCase().trim();

            const mainMatch = selectedMain.length ? selectedMain.includes(mainCat) : true;
            const subMatch = selectedSub.length ? selectedSub.includes(subCat) : true;
            const filterMatch = selectedFilters.length ? selectedFilters.includes(filterCat) : true;

            return mainMatch && subMatch && filterMatch;
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

        dispatch({
            type: "COLOR",
            payload: { 
                color: color.toLowerCase()
            }
        });
    }

    function filterColor(products) {
        const selectedColors = state.color || [];
        return selectedColors.length ? products.filter(product => selectedColors.includes(product.color?.toLowerCase())) : products;
    }


    //material

    function setMaterial(material) {
        if (!material) return;

        dispatch({
            type: "MATERIAL",
            payload: { 
                material: material.toLowerCase() 
            }
        });
    }

    function filterMaterial(products) {
        const selectedMaterials = state.material || [];
        return selectedMaterials.length ? products.filter(product => selectedMaterials.includes(product.fabric?.toLowerCase().trim())) : products;
    }
    


    //designer

    function setDesigner(designer) {
        if (!designer) return;

        dispatch({
            type: "DESIGNER",
            payload: { 
                designer: designer.toLowerCase() 
            }
        });
    }

    function filterDesigner(products) {
        const selectedDesigners = state.designer || [];
        return selectedDesigners.length ? products.filter(product => selectedDesigners.includes(product.designer?.toLowerCase())) : products;
    }   


    //plus size

    function setPlusSize(plusSize) {
        if (!plusSize) return;

        dispatch({
            type: "PLUS_SIZE",
            payload: { 
                plusSize: plusSize.toLowerCase()
            }
        });
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

        dispatch({
            type: "OCCASION",
            payload: { occasion: occasion.toLowerCase() }
        });
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

        dispatch({
            type: "SIZE",
            payload: { 
                size: size.toLowerCase() 
            }
        });
    }

    function filterSize(products) {
        const selectedSizes = state.size || [];
        if (!selectedSizes.length) return products;

        return products.filter(product => {
            const productSizes = product?.size?.split(",").map(s => s.trim().toLowerCase()) || [];
            return selectedSizes.some(size => productSizes.includes(size));
        });
    }



    //celebrity

    function setCelebrity(celebrity) {
        if (!celebrity) return;

        dispatch({
            type: "CELEBRITY",
            payload: { 
                celebrity: celebrity.toLowerCase() 
            }
        });
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

        dispatch({
            type: "SHIPPING_TIME",
            payload: { 
                shippingTime: shippingTime.toLowerCase() 
            }
        });
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
        dispatch({
            type: "SORT_BY",
            payload: {
                sortBy: sortBy
            }
        })
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
        dispatch({
            type: "NEW_ARRIVAL",
            payload: {
                newIn: value
            }
        })
    }

    function filterNewArrival(products) {
        return state.newIn ? products.filter(product => product.new_arrival === "1" || product?.new_arrival === true) : products;
    }



    //ready to ship

    function setReadyToShip(value) {
        dispatch({
            type: "READY_TO_SHIP",
            payload: {
                readyToShip: value
            }
        })
    }

    function filterReadyToShip(products) {
        return state.readyToShip ? products.filter(product => (product?.rts_quantity * 1) > 0) : products;
    }


    // custom fit

    function setCstmFit(value) {
        dispatch({
            type: "CSTM_FIT",
            payload: {
            cstmFit: value,
            },
        });
    }

    function filterCstmFit(products) {
        return state.cstmFit ? products.filter(product => product?.custom_fit?.toString().trim().toLowerCase() === "yes") : products;
    }


    //on sale

    function setOnSale(value) {
        dispatch({
            type: "ON_SALE",
            payload: {
                onSale: value
            }
        })
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
        filterCtgry: state.filterCategory,
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
        resetFilter
    }

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