import React from 'react'
import { Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import { CSVLink } from "react-csv";

export default function AlertsModule({ Data, timeConverter, loading, alertsPerPage, page, Headers, csvData }) {
  if (Data) {
    var rows = Data.reverse().map((alt, i) => {
      var AlertTimeNow;
      if (!alt.timestamp) {
        AlertTimeNow = '';
      } else {
        AlertTimeNow = timeConverter(alt.timestamp);
      }
      return <tr key={i} style={{ height: '30px' }}>
        <td >{i + 1 + (page - 1) * alertsPerPage}</td>
        <td >{alt.event}</td>
        <td>{alt.asset_id}</td>
        <td>{alt.registered_site_id}</td>
        <td>{alt.alert_site_id}</td>
        <td>{alt.alert_type}</td>
        <td>{AlertTimeNow}</td>
      </tr>
    })
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xl={12}>
          <Card>
            <CardHeader>
              <i className="fa fa-bell"></i> Alerts
              <CSVLink data={csvData} headers={Headers} filename={"Alerts.csv"} className='card-header-actions'>
                <Button color="primary" size="sm" className="btn-pill">Export CSV</Button>
              </CSVLink>
            </CardHeader>
            <CardBody>
              <Table hover bordered striped responsive size="sm" className="table table-striped table-dark">
                <thead>
                  <tr>
                    <th>Sr#</th>
                    <th>Events</th>
                    <th>Asset Id </th>
                    <th>Registered Site Id</th>
                    <th>Site Id</th>
                    <th>Alert Type</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

/***
Hello Yasir!, I have posted a mutual friend's comment abt your personality according to your
idealogical thoughts pattren nothing more like to attack on your personal life.
I have just posted it the unfortunate mistake which we have made is your permission we appologise for that.
 if you think it's attack on your current life so please tell me i'll remove it.
 If you think it's your own metter no one has right to discuss it then please think abt
 forcefully implementing your thoughts on anyone at planet by your gribness.
 Everyone has own ideas and follow any theory by own choice no one has right to disgrac him or devalue him.
 */