import { NextApiRequest, NextApiResponse } from 'next'

// Cette API permet de revalider les pages statiques
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extraire le chemin de la requête
    const path = req.query.path as string || '/multi-charts'
    
    // Revalider la page
    await res.revalidate(path)
    
    return res.json({
      revalidated: true,
      path,
      message: 'Revalidation successful'
    })
  } catch (err) {
    // Si une erreur se produit, renvoyer un statut 500
    return res.status(500).json({
      error: 'Error revalidating',
      message: err instanceof Error ? err.message : 'Unknown error'
    })
  }
}
