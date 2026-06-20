import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DeviceDetectorMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const ua = (req.headers['user-agent'] || '').toLowerCase();
    const device = {
      type: 'desktop',
      os: 'unknown',
      browser: 'unknown',
      isMobile: false,
      isTablet: false,
    };

    if (/mobile|android.*mobile|iphone|ipod|blackberry/i.test(ua)) {
      device.type = 'mobile';
      device.isMobile = true;
    } else if (/ipad|tablet|playbook|silk/i.test(ua)) {
      device.type = 'tablet';
      device.isTablet = true;
    }

    if (/android/i.test(ua)) device.os = 'android';
    else if (/iphone|ipad|ipod/i.test(ua)) device.os = 'ios';
    else if (/windows/i.test(ua)) device.os = 'windows';
    else if (/macintosh|mac os/i.test(ua)) device.os = 'macos';
    else if (/linux/i.test(ua)) device.os = 'linux';

    if (/chrome/i.test(ua) && !/edg/i.test(ua)) device.browser = 'chrome';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) device.browser = 'safari';
    else if (/firefox/i.test(ua)) device.browser = 'firefox';
    else if (/edg/i.test(ua)) device.browser = 'edge';

    (req as any).device = device;
    next();
  }
}
