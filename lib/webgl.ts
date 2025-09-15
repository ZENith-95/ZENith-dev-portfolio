"use client";

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const hasWebGL2 = !!(window as any).WebGL2RenderingContext && !!canvas.getContext("webgl2");
    const hasWebGL1 = !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl" as any));
    return hasWebGL2 || hasWebGL1;
  } catch {
    return false;
  }
}

