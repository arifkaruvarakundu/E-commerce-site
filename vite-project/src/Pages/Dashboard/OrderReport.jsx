import React from 'react';
import AxiosInstance from '../../../Axios_instance';

const OrderSalesReport = () => {
  
    const axios = AxiosInstance();

    const handleDownloadPDF = () => {
        axios.get('download_order_pdf_sales/', { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'order_sales_report.pdf');
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                console.error('Error downloading PDF:', error);
            });
    };

    const handleDownloadCSV = () => {
        axios.get('report_csv/', { responseType: 'blob' })
            .then(response => {
              console.log("response csv:",response.data)
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'order_sales_report.csv');
                document.body.appendChild(link);
                link.click();
            })
            .catch(error => {
                console.error('Error downloading CSV:', error);
            });
    };

    return (
      <div className="container">
      <div className="row justify-content-center mt-5">
          <div className="col-md-6">
              <div className="card">
                  <div className="card-body text-center">
                      <h2 className="card-title">Order Sales Report</h2>
                      <div className="btn-group" role="group">
                          <button className="btn btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
                          <span style={{ margin: '0 10px' }}></span>
                          <button className="btn btn-primary" onClick={handleDownloadCSV}>Download CSV</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
    );
};

export default OrderSalesReport;
