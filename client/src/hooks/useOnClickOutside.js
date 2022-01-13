import { useEffect } from "react"

const useOnClickOutside = (ref, handler, conditions) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref) {
        return
      }
      if (!ref.current || ref.current.contains(e.target)) {
        return
      }

      if (conditions && !conditions.every((el) => Boolean(el) === true)) {
        return 
      }

      handler(e)
    }

    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('click', listener)
    };
  }, [ref, handler])
}

export default useOnClickOutside
