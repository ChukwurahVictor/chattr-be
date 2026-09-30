import * as buffer from 'buffer';

// Node 25 polyfill for legacy buffer-equal-constant-time dependency
if (!(buffer as any).SlowBuffer) {
  (buffer as any).SlowBuffer = buffer.Buffer;
}
