import React from 'react';
import AxiosInstance from '../../../Axios_instance';

const OrderSalesReport = () => {
    const axios = AxiosInstance()
  const handleDownload = () => {
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
  }

  return (
    <div>
      <h2>Order Sales Report</h2>
      <button onClick={handleDownload}>Download PDF</button>
    </div>
  );
}

export default OrderSalesReport;
