import { useState } from "react";
import { axiosInstance } from "../../api/axiosInstance";
import { BarChart, DoughnutChart, LineChart, PieChart } from "../../components/Charts";


export default function Charts() {

  // Implant.body
  const [dataBodyType, setDataBodyType] = useState([])
  const [labelBodyType, setLabelBodyType] = useState([])
  const onClickImplantBody = async (param) => {
    try {
      const obj = {
        param: param
      }
      const result = await axiosInstance.post('/admin/charts', obj)

      var data = []
      var labels = []
      result.data.forEach(item => {
        data.push(item.count)
        labels.push(item._id)
      });

      setDataBodyType(data)
      setLabelBodyType(labels)
    } catch (error) {

    }
  }

  // bone type
  const [dataBoneType, setDataBoneType] = useState([])
  const [labelBoneType, setLabelBoneType] = useState([])
  const onClickBoneType = async (param) => {
    try {
      const obj = {
        param: param
      }
      const result = await axiosInstance.post('/admin/charts', obj)

      var data = []
      var labels = []
      result.data.forEach(item => {
        data.push(item.count)
        labels.push(item._id)
      });

      setDataBoneType(data)
      setLabelBoneType(labels)
    } catch (error) {

    }
  }

  // implant diameter type
  const [dataDiameter, setDataDiameter] = useState([])
  const [labelDiameter, setLabelDiameter] = useState([])
  const onClickDiameter = async (param) => {
    try {
      const obj = {
        param: param
      }
      const result = await axiosInstance.post('/admin/charts', obj)

      var data = []
      var labels = []
      result.data.forEach(item => {
        data.push(item.count)
        labels.push(item._id)
      });

      setDataDiameter(data)
      setLabelDiameter(labels)
    } catch (error) {

    }
  }

  // implant size type
  const [dataImplantSize, setDataImplantSize] = useState([])
  const [labelImplantSize, setLabelImplantSize] = useState([])
  const onClickImplantSize = async (param) => {
    try {
      const obj = {
        param: param
      }
      const result = await axiosInstance.post('/admin/charts', obj)

      var data = []
      var labels = []
      result.data.forEach(item => {
        data.push(item.count)
        labels.push(item._id)
      });

      setDataImplantSize(data)
      setLabelImplantSize(labels)
    } catch (error) {

    }
  }


  // implant diameter type
  const [dataDateDiff, setDataDateDiff] = useState([])
  const [labelDateDiff, setLabelDateDiff] = useState([])
  const onClickDateDiff = async (param) => {
    try {
      const obj = {
        param: param
      }
      const result = await axiosInstance.post('/admin/charts', obj)

      var data = []
      var labels = []
      result.data.forEach(item => {
        data.push(item.count)
        labels.push(item._id)
      });

      setDataDateDiff(data)
      setLabelDateDiff(labels)
    } catch (error) {

    }
  }

  return (
    <div className="container mt-5">

        <div className="row">
          <div className="col-md-4 col-12 mx-auto">
            <h4 onClick={() => onClickImplantBody('implant.bodytype')} style={{ cursor: 'pointer' }}>سطح ایمپلنت</h4>
            <hr></hr>
            <DoughnutChart
              chartdata={dataBodyType}
              labels={labelBodyType}
              label='سطح ایمپلنت'
              backgroundColor={['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)']}
            />
          </div>
          <div className="col-md-4 col-12 mx-auto">
            <h4 onClick={() => onClickBoneType('boneType')} style={{ cursor: 'pointer' }} >نوع استخوان</h4>
            <hr></hr>
            <PieChart
              chartdata={dataBoneType}
              labels={labelBoneType}
              label='نوع استخوان'
              backgroundColor={['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(100, 205, 120)']}
            />
          </div>
        </div>
        <hr></hr>

        <div className="row">
          <div className="col-md-4 col-12 mx-auto">
            <h4 onClick={() => onClickDiameter('implant.diameter')} style={{ cursor: 'pointer' }}>قطر ایمپلنت</h4>
            <hr></hr>
            <BarChart
              chartdata={dataDiameter}
              labels={labelDiameter}
              label='قطر ایمپلنت'
            // borderColor={['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)']}
            // backgroundColor={['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)']}
            />
          </div>
          <div className="col-md-4 col-12 mx-auto">
            <h4 onClick={() => onClickImplantSize('implant.size')} style={{ cursor: 'pointer' }} >اندازه ایمپلنت</h4>
            <hr></hr>
            <BarChart
              chartdata={dataImplantSize}
              labels={labelImplantSize}
              label='سایز ایمپلنت'
            />
          </div>
          <div className="col-md-4 col-12 mx-auto">
            <h4 onClick={() => onClickDateDiff('dateDiff')} style={{ cursor: 'pointer' }} >فاصله زمانی fail شدن</h4>
            <hr></hr>
            <LineChart
              chartdata={dataDateDiff}
              labels={labelDateDiff}
              label='فاصله زمانی'
            />
          </div>
        </div>

    </div>
  )
}