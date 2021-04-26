#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D iChannel0;

varying vec2 fragCoord;

#define A .3 // Amplitude
#define V 5. // Velocity
#define W 3. // Wavelength
#define T .15 // Thickness
#define S 2.0 // Sharpness

float sine(vec2 p, float o)
{
  return pow(T / abs((p.y + sin((p.x * W + o)) * A)), S);
}

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
{
  const vec4 C = vec4(0.211324865405187,
  0.366025403784439,
  -0.577350269189626,
  0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main(void)
{
  float delta = 0.85;
  vec2 pos = 2.0 * (fragCoord.xy/resolution) - 1.0;
  vec2 vUv = (fragCoord.xy/resolution);
  pos.x*=0.5;

  float noise = snoise(vec2(pos.x*4.0,time*0.8));
  float point = (1.0-pow(2.0*abs(pos.x),2.0))*(sin(time*0.8)*0.1+0.2*noise+pow(snoise(vec2(pos.x*7.0,time*2.0)),4.0)*0.1);
  float point2 = (1.0-pow(2.0*abs(pos.x),2.0))*(sin(time*0.8)*0.1+0.5*noise+pow(snoise(vec2(pos.x*5.0,time*2.0)),3.0)*0.12);
  float point3 = (1.0-pow(2.0*abs(pos.x),2.0))*(sin(time*0.8)*0.1+0.3*snoise(vec2(pos.x*2.0,(time)*0.5)));
  float color = 1.0-pow(abs(point-pos.y),0.4);
  float color2 = 1.0-pow(abs(point2-pos.y),0.4);
  float color3 = 1.0-pow(abs(point3-pos.y),0.4);

  color3 = pow(color3,2.0);
  color2 = pow(color2,2.0);
  color = pow(color,2.0);

  vec3 totalColor = vec3(color+color2+color3, color*0.7+color2*0.5+color3*0.6, color+color2+color3);
  totalColor += vec3(sine(pos, V)) * totalColor;
  totalColor *= clamp(pow(vUv.x + delta + color * 0.15, 15.0), 0.0, 1.0);
  totalColor *= clamp(pow((1.0 - vUv.x) + delta + color * 0.15, 15.0), 0.0, 1.0);

  totalColor *= clamp(pow(vUv.x + delta + color * 0.15, 40.0), 0.0, 1.0);
  totalColor *= clamp(pow((1.0 - vUv.x) + delta + color * 0.15, 40.0), 0.0, 1.0);

  gl_FragColor = vec4(totalColor * vec3(0.75, 0.4 ,0.75), clamp(max(totalColor.b, max(totalColor.g, totalColor.r)), 0.0, 1.0));
}
