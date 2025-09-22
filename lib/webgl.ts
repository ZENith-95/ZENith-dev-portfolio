"use client";

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");

    const release = (gl: WebGLRenderingContext | WebGL2RenderingContext | null) => {
      if (!gl) return;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };

    if ((window as any).WebGL2RenderingContext) {
      const gl2 = canvas.getContext("webgl2");
      if (gl2) {
        release(gl2);
        return true;
      }
    }

    const gl = (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (gl) {
      release(gl);
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
