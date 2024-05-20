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

    const cFreq = Number.parseFloat(cFrequency)
    const iFreq = Number.parseFloat(iFrequency)
    const cAmp = Number.parseFloat(cAmplitude)
    const iAmp = Number.parseFloat(iAmplitude) * Math.PI / 6

    if (iAmp <= 0 || cAmp <= 0 || cFreq <= 0 || iFreq <= 0)
        alert("Amplitude and frequency must be greater than 0")

    if (iFreq >= cFreq)
        alert("Carrier freq must be greater than information freq")

    if (iAmp > cAmp)
        alert("Information amplitude can't be greater than information amp")

    const signalC: Point[] = []
    const signalM: Point[] = []
    const signalI: Point[] = []
    const rangeC: Point[] = []
    const rangeM: Point[] = []
    const rangeI: Point[] = []

    const k= iAmp / cAmp;
    const T = 2 * Math.PI / (2 * Math.PI * Math.min(cFreq, iFreq))

    for (let t = 0; t < 2 * T; t += 0.001) {
        const cy = cAmp * Math.cos(2 * Math.PI * cFreq * t)
        const iy = iAmp * Math.cos(2 * Math.PI * iFreq * t)
        const my = cy * (1 + k * Math.cos(2 * Math.PI * iFreq * t))

        signalM.push({x: t, y: my})
        signalI.push({x: t, y: iy})
        signalC.push({x: t, y: cy})
    }


    // crange //
    for (let i = -10; i < -cFreq; i += 0.01)
        rangeC.push({x: i, y: 0})

    for (let i = cAmp; i > 0; i -= 0.01) {
        rangeC.push({x: -cFreq, y: i})
    }

    for (let i = cAmp; i > 0; i -= 0.01) {
        rangeC.push({x: cFreq, y: i})
    }

    for (let i = cFreq; i < 10; i += 0.01)
        rangeC.push({x: i, y: 0})



    // irange //
    for (let i = -10; i < -iFreq; i += 0.01)
        rangeI.push({x: i, y: 0})

    for (let i = iAmp; i > 0; i -= 0.01) {
        rangeI.push({x: -iFreq, y: i})
    }

    for (let i = iAmp; i > 0; i -= 0.01) {
        rangeI.push({x: iFreq, y: i})
    }

    for (let i = iFreq; i < 10; i += 0.01)
        rangeI.push({x: i, y: 0})



    // mrange //
    for (let i = -10; i < -iFreq - cFreq; i += 0.01)
        rangeM.push({x: i, y: 0})

    for (let i = iAmp / 2; i > 0; i -= 0.01)
        rangeM.push({x: -iFreq - cFreq, y: i})

    rangeM.push({x: -cFreq, y: 0})
    for (let i = cAmp; i > 0; i -= 0.01)
        rangeM.push({x: -cFreq, y: i})

    rangeM.push({x: iFreq - cFreq, y: 0})
    for (let i = iAmp / 2; i > 0; i -= 0.01)
        rangeM.push({x: iFreq - cFreq, y: i})

    rangeM.push({x: cFreq - iFreq, y: 0})
    for (let i = iAmp / 2; i > 0; i -= 0.01)
        rangeM.push({x: cFreq - iFreq, y: i})

    rangeM.push({x: cFreq, y: 0})
    for (let i = cAmp; i > 0; i -= 0.01)
        rangeM.push({x: cFreq, y: i})

    rangeM.push({x: iFreq + cFreq, y: 0})
    for (let i = iAmp / 2; i > 0; i -= 0.01)
        rangeM.push({x: iFreq + cFreq, y: i})

    for (let i = iFreq + cFreq; i < 10; i += 0.01)
        rangeM.push({x: i, y: 0})

    
    const cmp = (a: Point, b: Point) => Math.min(a.x, b.x)

    rangeC.sort(cmp)
    rangeI.sort(cmp)
    rangeM.sort(cmp)


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
            </div>

            <div className={"plots"}>
                <div className={"plot1"}>
                    <Plot
                        width={1200}
                        height={300}
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
                        height={300}
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
                        height={300}
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
                        height={300}
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
                        height={300}
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
                        height={300}
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
