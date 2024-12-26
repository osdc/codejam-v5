// import styles from "@/components/ItemForm.module.css";

const ItemForm = () => {
  return (
    <div>
      {/* <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/5/56/Logo-jiit.png"
              alt="JIIT Logo"
            />
            Lost & Found
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#report">
                  Report Item
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#search">
                  Search Items
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}
      <div className="header">
        <img
          src="https://psychographicsociety.com/wp-content/uploads/2023/05/JIIT-Noida.jpg"
          alt="College Campus"
        />
        <h1>Welcome to JIIT's Lost and Found</h1>
        <p>Your one-stop solution for reporting and finding lost items.</p>
      </div>
      <div className="container mt-5">
        <section id="report">
          <h2>Report Item</h2>
          <div className="radio-group">
            <input type="radio" id="lost" name="reportType" value="lost" />
            <label htmlFor="lost">Lost Item</label>

            <input type="radio" id="found" name="reportType" value="found" />
            <label htmlFor="found">Found Item</label>
          </div>
          <form className="mb-5" id="report-form">
            <div className="mb-3">
              <label htmlFor="itemName" className="form-label">
                Item Name
              </label>
              <input
                type="text"
                className="form-control"
                id="itemName"
                placeholder="Enter item name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="itemDescription" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="itemDescription"
                rows={3}
                placeholder="Provide a detailed description"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="itemDate" className="form-label">
                Date
              </label>
              <input type="date" className="form-control" id="itemDate" />
            </div>
            <div className="mb-3">
              <label htmlFor="itemLocation" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="itemLocation"
                placeholder="Enter location"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="campus" className="form-label">
                Campus
              </label>
              <select className="form-control" id="campus">
                <option value="62">Campus 62</option>
                <option value="128">Campus 128</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="contactInfo" className="form-label">
                Your Contact Information
              </label>
              <input
                type="email"
                className="form-control"
                id="contactInfo"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="itemImage" className="form-label">
                Upload an Image (Optional)
              </label>
              <input
                type="file"
                className="form-control"
                id="itemImage"
                accept="image/*"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </section>

        <section id="search">
          <h2>Search Items</h2>
          <form className="mb-5">
            <div className="mb-3">
              <label htmlFor="searchQuery" className="form-label">
                Search
              </label>
              <input
                type="text"
                className="form-control"
                id="searchQuery"
                placeholder="Enter item name or keyword"
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Search
            </button>
          </form>
        </section>
      </div>
      <footer>
        <p>&copy; 2024 JIIT | Lost and Found</p>
      </footer>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default ItemForm;
