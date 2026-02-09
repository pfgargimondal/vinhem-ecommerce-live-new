import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { filterReducer } from "../reducers/filterReducers";

const filterInitialState = {
    productList: [],
    minPrice: 0,
    maxPrice: 1000000,
    // mainCategory: [],
    // subCategory: [],
    // filterCategory: [],
    mainCategory: null,
    subCategory: null,
    filterCategory: null,
    filterCategoryName: [],
    color: [],
    material: [],
    designer: [],
    plusSize: [],
    occasion: [],
    size: [],
    celebrity: [],
    discount: [],
    shippingTime: [],
    sortBy: null,
    newIn: false,
    readyToShip: null,
    onSale: false,
    cstmFit: false,
    page: 1
}


const FilterContext = createContext(filterInitialState);

export const FilterProvider = ({ children }) => {
    const [state, dispatch] = useReducer(filterReducer, filterInitialState);
    const navigate = useNavigate();
    const location = useLocation();    



    function updateURLWithFilters(newState) {
        // const searchParams = new URLSearchParams();

        const searchParams = new URLSearchParams(location.search);

        if (newState.mainCategory)
            searchParams.set("main", newState.mainCategory);

        if (newState.subCategory)
            searchParams.set("subpaths", newState.subCategory);

        if (newState.filterCategory) {
            searchParams.set("filterpaths", newState.filterCategory);
        } else {
            searchParams.delete("filterpaths");
        }
        // if (newState.filterCategory.length)
        //     searchParams.set("filterpaths", newState.filterCategory.join(","));

        if (newState.filterCategoryName.length)
            searchParams.set("filter", newState.filterCategoryName.join(","));

        if (newState.color.length)
            searchParams.set("color", newState.color.join(","));

        if (newState.material.length)
            searchParams.set("material", newState.material.join(","));

        if (newState.designer.length)
            searchParams.set("designer", newState.designer.join(","));

        // ✅🔥 ADD THIS (MOST IMPORTANT)
        if (newState.plusSize.length)
            searchParams.set("plusSize", newState.plusSize.join(","));

        if (newState.occasion.length)
            searchParams.set("occasion", newState.occasion.join(","));

        if (newState.size.length)
            searchParams.set("size", newState.size.join(","));

        if (newState.celebrity.length)
            searchParams.set("celebrity", newState.celebrity.join(","));

        if(newState.discount.length)
            searchParams.set("discount", newState.discount.join(","));

        if (newState.shippingTime.length)
            searchParams.set("shippingTime", newState.shippingTime.join(","));

        if (typeof newState.page === "number") {
            if (newState.page > 1) {
                searchParams.set("page", newState.page);
            } else {
                searchParams.delete("page");
            }
        }


        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }



    // function restoreFiltersFromURL() {
    //     const params = new URLSearchParams(location.search);

    //     const newState = {
    //         ...state,
    //         // mainCategory: params.get("main")?.split(",") || [],
    //         // subCategory: params.get("subpaths")?.split(",") || [],

    //         mainCategory: params.get("main") || null,
    //         subCategory: params.get("subpaths") || null,

    //         filterCategory: params.get("filterpaths")?.split(",") || [],
    //         filterCategoryName: params.get("filter")?.split(",") || [],

    //         // ✅ ADD THIS
    //         plusSize: params.get("plusSize")
    //             ? params.get("plusSize").split(",")
    //             : [],

    //         // (optional but recommended)
    //         color: params.get("color")?.split(",") || [],
    //         material: params.get("material")?.split(",") || [],
    //         designer: params.get("designer")?.split(",") || [],
    //         occasion: params.get("occasion")?.split(",") || [],
    //         size: params.get("size")?.split(",") || [],
    //         celebrity: params.get("celebrity")?.split(",") || [],
    //         shippingTime: params.get("shippingTime")?.split(",") || [],
    //     };


    //     dispatch({ type: "RESTORE_FROM_URL", payload: newState });
    // }


    function restoreFiltersFromURL() {
        const params = new URLSearchParams(location.search);

        const plusSizeFromUrl = params.get("plusSize")
            ? params.get("plusSize")
                .split(",")
                .map(v => v.trim().toLowerCase())  // trim & lowercase
                .filter(Boolean)                   // remove empty strings
            : [];

        const getArray = (key) => {
            const value = params.get(key);
            return value ? value.split(",").filter(Boolean) : [];
        };
        const pageFromUrl = Number(params.get("page")) || 1;

        const price = params.get("price");

        dispatch({
            type: "RESTORE_FROM_URL",
            payload: {
                mainCategory: params.get("main") || null,
                subCategory: params.get("subpaths") || null,

                filterCategory: params.get("filterpaths") || null,
                filterCategoryName: getArray("filter"),

                color: getArray("color"),
                material: getArray("material"),
                designer: getArray("designer"),
                plusSize: plusSizeFromUrl,   // ✅ FIXED
                occasion: getArray("occasion"),
                size: getArray("size"),
                celebrity: getArray("celebrity"),
                discount: getArray("discount"),
                shippingTime: getArray("shippingTime"),
                page: pageFromUrl,
            }
        });

        if (price) {
            const [min, max] = price.split("-").map(Number);

            dispatch({
                type: "PRICE",
                payload: {
                minPrice: min || 0,
                maxPrice: max || 1000000
                }
            });
        }
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

    // function setMainCategory(mainCategory) {
    //     const newState = {
    //         ...state,
    //         mainCategory: state.mainCategory.includes(mainCategory)
    //             ? state.mainCategory.filter(v => v !== mainCategory)
    //             : [...state.mainCategory, mainCategory]
    //     };

    //     dispatch({
    //         type: "MAIN_CATEGORY",
    //         payload: { mainCategory }
    //     });
        
    //     updateURLWithFilters(newState);
    // }

    function setMainCategory(mainCategory) {
        if (!mainCategory) return;

        const value =
            state.mainCategory === mainCategory
                ? null              // 🔥 UNCHECK
                : mainCategory;

        const newState = {
            ...state,
            mainCategory: value,
            subCategory: null,      // clear child
            filterCategory: null    // ✅ MUST be null (not array)
        };

        dispatch({
            type: "MAIN_CATEGORY",
            payload: { mainCategory: value }
        });

        updateURLWithFilters(newState);
    }

    function filterMainCategory(products) {
        // if (!state.mainCategory || state.mainCategory.length === 0) {
        //     return products;
        // }

        // return products.filter(product => {
        //     const productCategory = product?.product_category?.toLowerCase();
        //     return state.mainCategory.includes(productCategory);
        // });

        if (!state.mainCategory) return products;

        return products.filter(product =>
            product?.product_category?.toLowerCase() === state.mainCategory
        );
    }


    //sub category

    // function setSubCategory(mainCategory, subCategoryName) {
    //     if (!mainCategory || !subCategoryName) return;

    //     // BUILD FULL PATH: "women/kurta-sets"
    //     const subPath = `${mainCategory}/${subCategoryName}`.toLowerCase().replace(/ /g, '-');
        
    //     const newState = {
    //         ...state,
    //         subCategory: state.subCategory.includes(subPath)
    //             ? state.subCategory.filter(v => v !== subPath)
    //             : [...state.subCategory, subPath]
    //     };

    //     dispatch({
    //         type: "SUB_CATEGORY",
    //         payload: { subPath }  // Pass full path to reducer
    //     });

    //     updateURLWithFilters(newState);
    // }

    function setSubCategory(mainCategory, subCategoryName) {
        if (!mainCategory || !subCategoryName) return;

        // const subPath = `${mainCategory}/${subCategoryName}`
        const subPath = `${subCategoryName}`
            .toLowerCase()
            .replace(/ /g, "-");

        const value =
            state.subCategory === subPath
                ? null              // 🔥 UNCHECK
                : subPath;

        const newState = {
            ...state,
            subCategory: value,
            filterCategory: null    // ✅ MUST be null
        };

        dispatch({
            type: "SUB_CATEGORY",
            payload: { subPath: value }
        });

        updateURLWithFilters(newState);
    }

    function filterSubCategory(products) {
        // const selectedSubs = state.subCategory || [];
        // if (!selectedSubs.length) return products;

        // return products.filter(product => {
        //     const mainCat = product.product_category?.toLowerCase().trim();
        //     const subCat = product.product_sub_category?.toLowerCase().trim();
        //     if (!mainCat || !subCat) return false;
            
        //     const productSubPath = `${mainCat}/${subCat}`;
        //     return selectedSubs.includes(productSubPath);
        // });

        if (!state.subCategory) return products;

        return products.filter(product => {
            const mainCat = product.product_category?.toLowerCase();
            const subCat = product.product_sub_category?.toLowerCase();
            if (!mainCat || !subCat) return false;

            // return `${mainCat}/${subCat}` === state.subCategory;
            return `${subCat}` === state.subCategory;
        });
    }





    //filter category

    function setFilterCategory(mainCategory, subCategoryName, filterCategoryName) {
        if (!mainCategory || !subCategoryName || !filterCategoryName) return;

        // const filterPath = `${mainCategory}/${subCategoryName}/${filterCategoryName}`
        const filterPath = `${filterCategoryName}`
            .toLowerCase()
            .replace(/ /g, "-");

        const value =
            state.filterCategory === filterPath
                ? null               // 🔥 UNCHECK
                : filterPath;

        dispatch({
            type: "FILTER_CATEGORY",
            payload: { filterPath: value }
        });

        updateURLWithFilters({
            ...state,
            filterCategory: value
        });
    }

    function filterFilterCategory(products) {
        const selectedFilters = state.filterCategory || [];
        if (!selectedFilters.length) return products;

        return products.filter(product => {
            const mainCat = product.product_category?.toLowerCase().trim();
            const subCat = product.product_sub_category?.toLowerCase().trim();
            const filterCat = product.filter_categories?.toLowerCase().trim();
            
            if (!mainCat || !subCat || !filterCat) return false;
            
            // const productFilterPath = `${mainCat}/${subCat}/${filterCat}`;
            const productFilterPath = `${filterCat}`;
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

    //designer

    function setDiscount(discount) {
        if (!discount) return;

        const newState = {
            ...state,
            discount: state.discount.includes(discount)
                ? state.discount.filter(v => v !== discount)
                : [...state.discount, discount],

            page: 1 
        };

        dispatch({
            type: "DISCOUNT",
            payload: { discount }
        });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }

    function filterDiscount(products) {
        const selectedDiscounts = state.discount || [];

        if (!selectedDiscounts.length) return products;

        return products.filter(product => {
            const productDiscount = Number(product.discount); // "20" → 20
            if (isNaN(productDiscount)) return false;

            return selectedDiscounts.some(range => {
                // Remove % and spaces → split
                const [min, max] = range
                    .replace(/%/g, "")
                    .split("-")
                    .map(v => Number(v.trim()));

                return productDiscount >= min && productDiscount <= max;
            });
        });
    }


    //color

    function setColor(color) {
        if (!color) return;

        const newState = {
            ...state,
            color: state.color.includes(color)
                ? state.color.filter(v => v !== color)
                : [...state.color, color],
            
            page: 1 
        };

        dispatch({
            type: "COLOR",
            payload: { color }
        });

        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }

    function filterColor(products) {
        const selectedColors = state.color || [];

        if (!selectedColors.length) return products;

        return products.filter(product => {
            const productColors = product.filter_color
                ?.toLowerCase()
                .split(",")
                .map(c => c.trim());

            if (!productColors?.length) return false;

            return selectedColors.some(selected =>
                productColors.some(productColor =>
                    productColor.includes(selected)
                )
            );
        });
    }



    //material

    function setMaterial(material) {
        if (!material) return;

        const newState = {
            ...state,
            material: state.material.includes(material)
                ? state.material.filter(v => v !== material)
                : [...state.material, material],

            page: 1 
        };

        dispatch({ type: "MATERIAL", payload: { material } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }

    function filterMaterial(products) {
        const selectedMaterials = state.material || [];
        if (!selectedMaterials.length) return products;

        return products.filter(product => {
            const productMaterials = product.filter_material
                ?.toLowerCase()
                .split(",")
                .map(m => m.trim());

            if (!productMaterials?.length) return false;

            return selectedMaterials.some(selected =>
                productMaterials.some(material =>
                    material.includes(selected)
                )
            );
        });
    }



    //designer

    function setDesigner(designer) {
        if (!designer) return;

        const newState = {
            ...state,
            designer: state.designer.includes(designer)
                ? state.designer.filter(v => v !== designer)
                : [...state.designer, designer],

            page: 1 
        };

        dispatch({ type: "DESIGNER", payload: { designer } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }

    function filterDesigner(products) {
        const selectedDesigners = state.designer || [];
        return selectedDesigners.length ? products.filter(product => selectedDesigners.includes(product.designer?.toLowerCase())) : products;
    }


    //plus size

    // function setPlusSize(plusSize) {
    //     if (!plusSize) return;

    //     const newState = {
    //         ...state,
    //         plusSize: state.plusSize.includes(plusSize)
    //             ? state.plusSize.filter(v => v !== plusSize)
    //             : [...state.plusSize, plusSize]
    //     };

    //     dispatch({ type: "PLUS_SIZE", payload: { plusSize } });
    //     updateURLWithFilters(newState);
    // }


    function setPlusSize(plusSize) {
        if (!plusSize || typeof plusSize !== "string") return;

        // const normalizedSize = plusSize.trim().toLowerCase();
        // if (!normalizedSize) return;

        // const updatedPlusSize = state.plusSize.includes(normalizedSize)
        //     ? state.plusSize.filter(v => v !== normalizedSize)
        //     : [...state.plusSize, normalizedSize];

        // // Dispatch
        // dispatch({ type: "PLUS_SIZE", payload: { plusSize } });

        // // Update URL
        // updateURLWithFilters({
        //     ...state,
        //     plusSize: updatedPlusSize.filter(Boolean)  // ✅ clean array
        // });

        const newState = {
            ...state,
            plusSize: state.plusSize.includes(plusSize)
                ? state.plusSize.filter(v => v !== plusSize)
                : [...state.plusSize, plusSize],

            page: 1 
        };

        dispatch({ type: "PLUS_SIZE", payload: { plusSize } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }







    // function filterPlusSize(products) {
    //     const selectedSizes = state.plusSize || [];
    //     if (!selectedSizes.length) return products;

    //     return products.filter(product => {
    //         const sizes = product.product_plus_size;

    //         if (Array.isArray(sizes)) {
    //             return selectedSizes.some(size => sizes.map(s => s.toLowerCase()).includes(size));
    //         }

    //         if (typeof sizes === "string") {
    //             const sizeArray = sizes.split(",").map(s => s.trim().toLowerCase());
    //             return selectedSizes.some(size => sizeArray.includes(size));
    //         }

    //         return false;
    //     });
    // }



    //occasion

    function filterPlusSize(products) {
        const selectedSizes = state.plusSize || [];
        if (!selectedSizes.length) return products;

        // return products.filter(product => {
        //     const rawSizes = product?.product_plus_size;

        //     // 🚨 CRITICAL GUARD
        //     if (!rawSizes || typeof rawSizes !== "string") return false;

        //     const sizeArray = rawSizes
        //         .split(",")
        //         .map(s => s.trim().toLowerCase())
        //         .filter(Boolean);

        //     return selectedSizes
        //     .filter(size => typeof size === "string")
        //     .some(size =>
        //         sizeArray.includes(size.toLowerCase())
        //     );
        // });

        return products.filter(product => {
            const productSizes =
                typeof product?.product_plus_size === "string"
                    ? product.product_plus_size.split(",").map(s => s.trim().toLowerCase())
                    : [];

            return selectedSizes.some(size => productSizes.includes(size));
        });
    }



    function setOccasion(occasion) {
        if (!occasion) return;

        const newState = {
            ...state,
            occasion: state.occasion.includes(occasion)
                ? state.occasion.filter(v => v !== occasion)
                : [...state.occasion, occasion],
            page: 1 
        };

        dispatch({ type: "OCCASION", payload: { occasion } });
        dispatch({ type: "PAGE", payload: { page: 1 } });

        updateURLWithFilters(newState);
    }


    function filterOccasion(products) {
        const selectedOccasions = state.occasion || [];
        if (!selectedOccasions.length) return products;

        return products.filter(product => {
            const productOccasions = product.filter_occasion
                ?.toLowerCase()
                .split(",")
                .map(o => o.trim());

            if (!productOccasions?.length) return false;

            return selectedOccasions.some(selected =>
                productOccasions.some(productOccasion =>
                    productOccasion.includes(selected)
                )
            );
        });
    }



    //size

    function setSize(size) {
        if (!size) return;

        const newState = {
            ...state,
            size: state.size.includes(size)
                ? state.size.filter(v => v !== size)
                : [...state.size, size],
            page: 1 
        };

        dispatch({ type: "SIZE", payload: { size } });
        dispatch({ type: "PAGE", payload: { page: 1 } });
        updateURLWithFilters(newState);
    }

    // function filterSize(products) {
    //     const selectedSizes = state.size || [];
    //     if (!selectedSizes.length) return products;

    //     return products.filter(product => {
    //         const productSizes = product?.product_size?.split(",").map(s => s.trim().toLowerCase()) || [];
    //         return selectedSizes.some(size => productSizes.includes(size));
    //     });
    // }

    function filterSize(products) {
        const selectedSizes = state.size || [];
        if (!selectedSizes.length) return products;

        return products.filter(product => {
            const productSizes =
                typeof product?.product_size === "string"
                    ? product.product_size.split(",").map(s => s.trim().toLowerCase())
                    : [];

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
                : [...state.celebrity, celebrity],

            page: 1 
        };

        dispatch({ type: "CELEBRITY", payload: { celebrity } });
        dispatch({ type: "PAGE", payload: { page: 1 } });
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
                : [...state.shippingTime, shippingTime],

            page: 1 
        };

        dispatch({ type: "SHIPPING_TIME", payload: { shippingTime } });
        dispatch({ type: "PAGE", payload: { page: 1 } });
        updateURLWithFilters(newState);
    }

    function filterShippingTime(products) {

        const selectedShippingTimes = state.shippingTime || [];
        if (!selectedShippingTimes.length) return products;

        return products.filter(product => {
            const productShippingTime = product.shipping_time?.toLowerCase();
            return selectedShippingTimes.includes(productShippingTime);
        });
    }


    function setPage(page) {
        const newState = { ...state, page };

        dispatch({
            type: "PAGE",
            payload: { page }
        });

        updateURLWithFilters(newState);
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

    function removeDiscount(value) {
        dispatch({ type: "REMOVE_DISCOUNT", payload: value });
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
                            filterDiscount(
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

        discount: state.discount,
        setDiscount,

        shippingTime: state.shippingTime,
        setShippingTime,

        page: state.page,
        setPage,

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
        removeDiscount,
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