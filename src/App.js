import { useState, useEffect, useRef, forwardRef, createRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei'
import { useControls, button } from 'leva'
import create from 'zustand'

const useStore = create((set) => ({ target: null, setTarget: (target) => set({ target }) }))

const Box = forwardRef((props, ref) => {
  const { scene } = useThree()

  useEffect(() => {
    console.log('scene', scene)

    return () => {
      // console.log('scene', scene)
      // scene.add(ref)
    }
  }, [scene])

  const setTarget = useStore((state) => state.setTarget)
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      ref={ref}
      {...props}
      onClick={(e) => setTarget(e.object)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      attach={(parent, self) => {
        parent.add(self)
        console.log('parent, self', parent, self)
        return () => parent.remove(self)
      }}>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  )
})

const Group = forwardRef((props, ref) => {
  return <group ref={ref}></group>
})

export default function App() {
  const { target, setTarget } = useStore()
  // const [Comps, setComps] = useState([])
  const [Boxes, setBoxes] = useState([])
  const [Selected, setSelected] = useState([])
  const groupRef = useRef()
  const boxRefs = useRef([])

  // useEffect(() => {
  //   console.log('boxRefs.current', boxRefs.current)
  // }, [boxRefs.current])

  useEffect(() => {
    console.log('Selected', Selected)
    console.log('boxRefs.current', boxRefs.current)
  }, [Selected])

  const { mode } = useControls(
    {
      // mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] },
      addBox: button((get) => {
        const boxRef = createRef()
        setBoxes((prev) => [...prev, <Box ref={boxRef} />])
        boxRefs.current.push(boxRef)
      }),
      attachAllBoxToGroup: button((get) => {
        setSelected([...Boxes])
        setBoxes([])
      }),
      detachAllBoxFromGroup: button((get) => {})
    },
    []
  )

  return (
    <Canvas dpr={[1, 2]} onPointerMissed={() => setTarget(null)}>
      <Group ref={groupRef}>{Selected}</Group>
      {Boxes}
      {/* {target && <TransformControls object={target} mode={mode} />} */}
      <OrbitControls makeDefault />
    </Canvas>
  )
}
