import { useState, useEffect, useRef, forwardRef, createRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei'
import { useControls, button } from 'leva'
import create from 'zustand'
import { Vector3 } from 'three'

const useStore = create((set) => ({ target: null, setTarget: (target) => set({ target }) }))

const Box = forwardRef((props, ref) => {
  // useEffect(() => {
  //   console.log('scene', scene)

  //   return () => {
  //     // console.log('scene', scene)
  //     // scene.add(ref)
  //   }
  // }, [scene])

  // const boxRef = useRef()

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

const Edit = () => {
  const { scene } = useThree()
  const groupRef = useRef()
  const transFromControlRef = useRef()
  const boxRefs = useRef([])
  const [Boxes, setBoxes] = useState([])
  const [Selected, setSelected] = useState([])
  const { mode } = useControls(
    {
      addBox: button((get) => {
        const boxRef = createRef()
        boxRefs.current.push(boxRef)
        const boxKey = boxRefs.current.length - 1
        setBoxes((prev) => [...prev, <Box ref={boxRef} key={boxKey} />])
      }),
      attachAllBoxToGroup: button((get) => {
        // setSelected([...Boxes])
        boxRefs.current.forEach((boxRef) => {
          // console.log('boxRef', boxRef.current)
          groupRef.current.attach(boxRef.current)
        })
        console.log('scene.children', scene.children)
        // setBoxes([])
      }),
      detachAllBoxFromGroup: button((get) => {
        groupRef.current.children.forEach((box) => {
          const target = new Vector3(0, 0, 0)
          console.log('box.position before', box.getWorldPosition(target))
          box.removeFromParent()
          scene.attach(box)
          box.translateX(target.x)
          box.translateY(target.y)
          box.translateZ(target.z)
          console.log('box.position after', box.getWorldPosition(target))
          // box.translateOnAxis(transFromControlRef.current.worldPosition)
        })
        // console.log('scene.children', scene.children)
      }),
      log: button((get) => {
        // if (boxRefs.current) {
        //   boxRefs.current.forEach((box) => {
        //     // console.log('box.current', box.current.)
        //   })
        // }
        // if (transFromControlRef.current) {
        //   console.log('transFromControlRef', transFromControlRef.current.worldPosition)
        // }
        console.log('scene.children', scene.children)
      })
    },
    [Boxes, Selected, groupRef]
  )

  // useEffect(() => {
  //   console.log('Selected', Selected)
  //   console.log('scene', scene.children)
  // }, [Selected])

  // useEffect(() => {
  //   console.log('Boxes', Boxes)
  //   console.log('scene', scene.children)
  // }, [Boxes])

  // useEffect(() => {
  //   // console.log('Boxes', Boxes)
  //   console.log('groupRef updated, scene', scene.children)
  // }, [groupRef.current])

  // useEffect(() => {
  //   if (transFromControlRef.current) {
  //     console.log('transFromControlRef.current.position', transFromControlRef.current.position)
  //   }
  // }, [transFromControlRef.current])

  return (
    <>
      <group ref={groupRef}></group>
      {Boxes}
      {groupRef.current && <TransformControls ref={transFromControlRef} object={groupRef.current} mode={mode} />}
    </>
  )
}

export default function App() {
  // const { target, setTarget } = useStore()

  return (
    <Canvas dpr={[1, 2]} onPointerMissed={() => setTarget(null)}>
      <Edit />
      {/* {target && <TransformControls object={target} mode={mode} />} */}
      <OrbitControls makeDefault />
    </Canvas>
  )
}
