import { serialize } from 'cookie';

export default function handler(req, res) {
  const cookie = serialize('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: -1,
  });

  res.setHeader('Set-Cookie', cookie);
  res.redirect('/');
}
