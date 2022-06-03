import React, { useEffect, useRef } from 'react'
import * as tf from "@tensorflow/tfjs"
import * as movenet from "@tensorflow-models/pose-detection"
import Webcam from 'react-webcam'
import {drawKeypoints, drawSkeleton} from './utilities'

const App = () => {

  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const runmovenet = async () => {
    const detectorConfig = {modelType: movenet.movenet.modelType.SINGLEPOSE_LIGHTNING}
    const net = await movenet.createDetector(movenet.SupportedModels.MoveNet, detectorConfig)
    
    setInterval(() => {
      detect(net)
    }, 10);
  }

  const detect = async (net) => {
    if (typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4) {
      // get video property
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // set video height width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // set canvas height and width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      const obj = await net.estimatePoses(video)
      // console.log(obj)

      const ctx = canvasRef.current.getContext("2d")
      drawKeypoints(obj["0"].keypoints, 0.5, ctx)
      drawSkeleton(obj["0"].keypoints, 0.5, ctx)
    }
  }

  useEffect(() => {runmovenet()}, [])

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  )
}

export default App