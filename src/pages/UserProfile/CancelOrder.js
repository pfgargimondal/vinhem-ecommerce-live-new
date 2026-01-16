import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import Table from "react-bootstrap/Table";

import { UserProfileNavMenu } from "../../components";
import styles from "./Css/CancelOrder.module.css";
import http from "../../http";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";

export const CancelOrder = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [CanceledOrder, setCanceledOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const searchRef = useRef(null);

  /* =======================
      YEAR FILTER OPTIONS
  ======================= */
  const currentYear = new Date().getFullYear();

  const years = [
    `${currentYear - 2} - ${currentYear}`,
    ...Array.from(
      { length: currentYear - 2016 },
      (_, i) => (currentYear - 1 - i).toString()
    ),
  ];

  const [selected, setSelected] = useState(years[0]);

  /* =======================
      FETCH CANCELLED ORDERS
  ======================= */
  useEffect(() => {
    if (!token) return;

    const fetchCancelOrder = async () => {
      try {
        setLoading(true);
        const res = await http.get("/user/get-cancel-order", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCanceledOrder(res?.data?.data?.orders || []);
      } catch (error) {
        console.error("Failed to fetch cancel order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelOrder();
  }, [token]);

  /* =======================
      AUTO FOCUS SEARCH (ONCE)
  ======================= */
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  /* =======================
      FILTER LOGIC (NO BLINK)
  ======================= */
  const filteredOrders = useMemo(() => {
    let data = [...CanceledOrder];

    // Year filter
    if (selected) {
      if (selected.includes("-")) {
        const [start, end] = selected.split("-").map(Number);
        data = data.filter(order => {
          const year = new Date(order.order_date).getFullYear();
          return year >= start && year <= end;
        });
      } else {
        const year = Number(selected);
        data = data.filter(order =>
          new Date(order.order_date).getFullYear() === year
        );
      }
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(order =>
        order?.order_id?.toString().toLowerCase().includes(q)
      );
    }

    return data;
  }, [CanceledOrder, selected, search]);

  /* =======================
      UI
  ======================= */
  return (
    <div className={styles.ffhfdf}>
      {loading && <Loader />}

      <div className="ansjidnkuiweer">
        <div className={styles.fbghdfg}>
          <div className="row">
            <div className="col-lg-3">
              <UserProfileNavMenu />
            </div>

            <div className="col-lg-9">
              <div className={`${styles.fgcbdfgdf} pt-3 pb-5`}>
                <div className={`${styles.dfjhdsbfsdf} mb-4`}>
                  <h4 className="mb-0">Cancelled Orders</h4>

                  {/* SEARCH */}
                  <div className={styles.customSearchWrapper}>
                    <i className={`bi bi-search ${styles.customSearchIcon}`} />
                    <input
                      ref={searchRef}
                      type="text"
                      className={styles.customSearchInput}
                      placeholder="Search by Order No."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* FILTER */}
                  <div className={styles.filterWrapper}>
                    <button
                      className={styles.filterBtn}
                      onClick={() => setOpen(!open)}
                    >
                      <i className="bi bi-sliders" /> Filter
                    </button>

                    {open && (
                      <div className={styles.dropdown}>
                        <div
                          className={`${styles.option} ${styles.active}`}
                          style={{ pointerEvents: "none" }}
                        >
                          {selected}
                        </div>

                        {years
                          .filter(year => year !== selected)
                          .map((year, index) => (
                            <div
                              key={index}
                              className={styles.option}
                              onClick={() => {
                                setSelected(year);
                                setOpen(false);
                              }}
                            >
                              {year}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <p className="ndiwhermweoewrr mb-0 d-none">
                    <Link to="/">
                      <i className="fa-solid me-1 fa-arrow-left" /> Back To Home{" "}
                      <i className="fa-solid ms-1 fa-house" />
                    </Link>
                  </p>
                </div>

                {/* TABLE */}
                <div className={styles.dfgndfjhbgdfgdf}>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Order Id</th>
                        <th>Order Information</th>
                        <th>Order Date</th>
                        <th>Cancel Date</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map(CanceledOrderVal => (
                          <tr key={CanceledOrderVal.order_id}>
                            <td>{CanceledOrderVal.order_id}</td>

                            <td>
                                <div className={`${styles.sdfsdf} justify-content-between mb-3`}>
                                <p className="mb-0">
                                    No. of items: {CanceledOrderVal.total_orderProduct}
                                </p>

                                <p className={`${styles.oknknkmer} mb-0`} onClick={() => navigate(`/order-details/${CanceledOrderVal.order_id}`)}>
                                    <i className={`bi ${styles.vew_dtls} bi-eye`}></i> View Details
                                </p>
                                </div>

                                <div
                                className={`d-flex ${styles.dweknriwehrwer} align-items-center justify-content-between`}
                                >
                                <button className={`btn ${styles.cncl_ordr} border-0 px-0`}>
                                    <i className="bi me-1 bi-folder-x"></i> Cancelled Order
                                </button>
                                </div>
                            </td>

                            <td>
                                {CanceledOrderVal.order_date
                                ? CanceledOrderVal.order_date.split("-").reverse().join("-")
                                : ""}
                            </td>

                            <td>
                                {CanceledOrderVal.cancel_date
                                ? CanceledOrderVal.cancel_date.split("-").reverse().join("-")
                                : ""}
                            </td>

                            <td>₹{CanceledOrderVal.total_order_amount}</td>
                            </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            No orders found
                          </td> 
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
