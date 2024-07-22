import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { stage0 } from '@/assets/bots/nps/stage/0'

export async function stagesNps(message: MessageResponse, stageNumber: number) {
  switch (stageNumber) {
    case 0:
      return await stage0(message)
    default:
      console.error('Invalid stage number:', stageNumber)
  }
}
