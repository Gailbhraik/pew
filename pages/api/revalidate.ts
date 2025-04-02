import { NextApiRequest, NextApiResponse } from 'next'

// Cette API permet de vérifier l'état du serveur
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    return res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    // Si une erreur se produit, renvoyer un statut 500
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}
