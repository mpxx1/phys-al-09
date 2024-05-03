import './App.css'
import {useState} from "react";
import {Axis, Heading, Legend, LineSeries, Plot} from "react-plot";

type Point = {
    x: number
    y: number
}

function App() {
    const [cFrequency, setCFrequency] = useState("")
    const [iFrequency, setIFrequency] = useState("")
    const [cAmplitude, setCAmplitude] = useState("")
    const [iAmplitude, setIAmplitude] = useState("")
    const [k, setK] = useState("")

    const cFreq = Number.parseFloat(cFrequency)
    const iFreq = Number.parseFloat(iFrequency)
    const cAmp = Number.parseFloat(cAmplitude)
    const iAmp = Number.parseFloat(iAmplitude)
    const f = Number.parseFloat(k)

    if (iAmp <= 0 || cAmp <= 0 || cFreq <= 0 || iFreq <= 0)
        alert("Amplitude and frequency must be greater than 0")

    if (f <= 0 || f > 1)
        alert("Modulation factor must be greater than 0 and lower or equal to 1")

    const signalC: Point[] = []
    const signalM: Point[] = []
    const signalI: Point[] = []
    const rangeC: Point[] = []
    const rangeM: Point[] = []
    const rangeI: Point[] = []
    let flag0 = true
    let flagNeg = true
    let flagPos = true
    let flag01 = true
    let flagNeg1 = true
    let flagPos1 = true

    for (let t = 0; t < 1; t += 0.001) {
        const cy = cAmp * Math.cos(2 * Math.PI * cFreq * t)
        const iy = iAmp * Math.cos(2 * Math.PI * iFreq * t)
        const my = cy * (1 + f * cy / cAmp)

        signalM.push({x: t, y: my})
        signalI.push({x: t, y: iy})
        signalC.push({x: t, y: cy})
    }

    for (let freq = -cFreq - 10; freq < cFreq + 10; freq += 0.01) {
        if (freq != 0 && Math.abs(freq) != cFreq) {
            rangeC.push({x: freq, y: 0})
        }

        if (freq + 0.01 >= 0 && flag0) {
            flag0 = false
            rangeC.push({x: 0, y: cAmp})
        }

        if (freq + 0.01 >= -cFreq && flagNeg) {
            flagNeg = false
            rangeC.push({x: -cFreq, y: cAmp / 2})
        }

        if (freq + 0.01 >= cFreq && flagPos) {
            flagPos = false
            rangeC.push({x: cFreq, y: cAmp / 2})
        }
    }

    flag0 = true
    flagNeg = true
    flagPos = true

    for (let freq = -iFreq - 10; freq < iFreq + 10; freq += 0.01) {
        if (freq != 0 && Math.abs(freq) != iFreq) {
            rangeI.push({x: freq, y: 0})
        }

        if (freq + 0.01 >= 0 && flag0) {
            flag0 = false
            rangeI.push({x: 0, y: iAmp})
        }

        if (freq + 0.01 >= -iFreq && flagNeg) {
            flagNeg = false
            rangeI.push({x: -iFreq, y: iAmp / 2})
        }

        if (freq + 0.01 >= iFreq && flagPos) {
            flagPos = false
            rangeI.push({x: iFreq, y: iAmp / 2})
        }
    }

    flag0 = true
    flagNeg = true
    flagPos = true

    for (let freq = -iFreq - cFreq - 10; freq < iFreq + cFreq + 10; freq += 0.01) {
        rangeM.push({x: freq, y: 0})

        if (freq + 0.01 >= -iFreq && flag0) {
            flag0 = false
            rangeM.push({x: -iFreq, y: iAmp})
        }

        if (freq + 0.01 >= -iFreq - cFreq && flagNeg) {
            flagNeg = false
            rangeM.push({x: -iFreq - cFreq, y: iAmp * f / 2})
        }

        if (freq + 0.01 >= -iFreq + cFreq && flagPos) {
            flagPos = false
            rangeM.push({x: -iFreq + cFreq, y: f * iAmp / 2})
        }

        if (freq + 0.01 >= iFreq && flag01) {
            flag01 = false
            rangeM.push({x: iFreq, y: iAmp})
        }
        if (freq + 0.01 >= iFreq - cFreq && flagNeg1) {
            flagNeg1 = false
            rangeM.push({x: iFreq - cFreq, y: iAmp * f / 2})
        }
        if (freq + 0.01 >= iFreq + cFreq && flagPos1) {
            flagPos1 = false
            rangeM.push({x: iFreq + cFreq, y: iAmp * f / 2})
        }
    }


    return (
        <div className={"wrapper"}>
            <div className={"inputWrapper"}>
                <label> Enter values to see plots </label>

                <div>
                    <input
                        placeholder={"Carrier frequency, Hz"}
                        value={cFrequency}
                        onChange={(event) => setCFrequency(event.target.value)}
                    />
                </div>

                <div>
                    <input
                        placeholder={"Information signal frequency, Hz"}
                        value={iFrequency}
                        onChange={(event) => setIFrequency(event.target.value)}
                    />
                </div>

                <div>
                    <input
                        placeholder={"Carrier amplitude, V"}
                        value={cAmplitude}
                        onChange={(event) => setCAmplitude(event.target.value)}
                    />
                </div>

                <div>
                    <input
                        placeholder={"Information signal amplitude, V"}
                        value={iAmplitude}
                        onChange={(event) => setIAmplitude(event.target.value)}
                    />
                </div>

                <div>
                    <input
                        placeholder={"Modulation factor"}
                        value={k}
                        onChange={(event) => setK(event.target.value)}
                    />
                </div>
            </div>

            <div className={"plots"}>
                <div className={"plot1"}>
                    <Plot
                        width={1200}
                        height={700}
                    >

                        <Heading
                            title={"Carrier signal"}
                        ></Heading>

                        <Axis
                            id="x"
                            position="bottom"
                            label="Time, s"
                            displayPrimaryGridLines
                        />
                        <Axis
                            id="y"
                            position="left"
                            label="Amplitude, V"
                            displayPrimaryGridLines
                        />
                        <Legend position="right"/>

                        <LineSeries
                            data={signalC}
                            xAxis="x"
                            yAxis="y"
                            label={"Carrier signal"}
                            lineStyle={{strokeWidth: 3}}
                            displayMarkers={false}
                        />

                    </Plot>
                </div>

                <div className={"plot2"}>
                    <Plot
                        width={1200}
                        height={700}
                    >

                        <Heading
                            title={"Information signal"}
                        ></Heading>

                        <Axis
                            id="x"
                            position="bottom"
                            label="Time, s"
                            displayPrimaryGridLines
                        />
                        <Axis
                            id="y"
                            position="left"
                            label="Amplitude, V"
                            displayPrimaryGridLines
                        />
                        <Legend position="right"/>

                        <LineSeries
                            data={signalI}
                            xAxis="x"
                            yAxis="y"
                            label={"Information signal"}
                            lineStyle={{strokeWidth: 3}}
                            displayMarkers={false}
                        />

                    </Plot>
                </div>

                <div className={"plot3"}>
                    <Plot
                        width={1200}
                        height={700}
                    >

                        <Heading
                            title={"Amplitude modulated signal"}
                        ></Heading>

                        <Axis
                            id="x"
                            position="bottom"
                            label="Time, s"
                            displayPrimaryGridLines
                        />
                        <Axis
                            id="y"
                            position="left"
                            label="Amplitude, V"
                            displayPrimaryGridLines
                        />
                        <Legend position="right"/>

                        <LineSeries
                            data={signalM}
                            xAxis="x"
                            yAxis="y"
                            label={"Amplitude modulated signal"}
                            lineStyle={{strokeWidth: 3}}
                            displayMarkers={false}
                        />

                    </Plot>
                </div>

                <div className={"plot4"}>
                    <Plot
                        width={1200}
                        height={700}
                    >

                        <Heading
                            title={"Carrier range"}
                        ></Heading>

                        <Axis
                            id="x"
                            position="bottom"
                            label="Frequency, Hz"
                            displayPrimaryGridLines
                        />
                        <Axis
                            id="y"
                            position="left"
                            label="Amplitude, V"
                            displayPrimaryGridLines
                        />
                        <Legend position="right"/>

                        <LineSeries
                            data={rangeC}
                            xAxis="x"
                            yAxis="y"
                            label={"Carrier range"}
                            lineStyle={{strokeWidth: 3}}
                            displayMarkers={false}
                        />

                    </Plot>
                </div>

                <div className={"plot5"}>
                    <Plot
                        width={1200}
                        height={700}
                    >

                        <Heading
                            title={"Information range"}
                        ></Heading>

                        <Axis
                            id="x"
                            position="bottom"
                            label="Frequency, Hz"
                            displayPrimaryGridLines
                        />
                        <Axis
                            id="y"
                            position="left"
                            label="Amplitude, V"
                            displayPrimaryGridLines
                        />
                        <Legend position="right"/>

                        <LineSeries
                            data={rangeI}
                            xAxis="x"
                            yAxis="y"
                            label={"Information range"}
                            lineStyle={{strokeWidth: 3}}
                            displayMarkers={false}
                        />

                    </Plot>
                </div>

                <div className={"plot6"}>
                    <Plot
                        width={1200}
                        height={700}
                    >

                        <Heading
                            title={"Amplitude modulated range"}
                        ></Heading>

                        <Axis
                            id="x"
                            position="bottom"
                            label="Frequency, Hz"
                            displayPrimaryGridLines
                        />
                        <Axis
                            id="y"
                            position="left"
                            label="Amplitude, V"
                            displayPrimaryGridLines
                        />
                        <Legend position="right"/>

                        <LineSeries
                            data={rangeM}
                            xAxis="x"
                            yAxis="y"
                            label={"Amplitude modulated range"}
                            lineStyle={{strokeWidth: 3}}
                            displayMarkers={false}
                        />

                    </Plot>
                </div>
            </div>
        </div>
    )
}

export default App
