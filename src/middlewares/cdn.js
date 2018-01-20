'use strict';

import qiniu from 'qiniu';
import config from '../config';

const { accessKey, secretKey, domain, bucket } = config.cdn;
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// generate upload token
export function uptoken() {
  // File size limit 2G
  const SIZE = 2 * 1024 * 1024 * 1024;
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    expires: 3 * 3600,
    fsizeLimit: SIZE
  });
  return putPolicy.uploadToken(mac);
}

// generate download address
export function downUrl(key) {
  const conf = new qiniu.conf.Config();
  const manager = new qiniu.rs.BucketManager(mac, conf);
  // validity 24 hour
  const deadline = parseInt(Date.now() / 1000) + 3600 * 24;
  return manager.privateDownloadUrl(domain, key, deadline);
}