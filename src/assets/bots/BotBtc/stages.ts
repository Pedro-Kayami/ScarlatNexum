import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { stage0 } from '@/assets/bots/BotBtc/stage/0'
import { stage1 } from '@/assets/bots/BotBtc/stage/1'
import { stage2 } from '@/assets/bots/BotBtc/stage/2'
import { stage3 } from '@/assets/bots/BotBtc/stage/3'
export async function stagesBTC(message: MessageResponse, stageNumber: number) {
  switch (stageNumber) {
    case 0:
      return await stage0(message)
    case 1:
      return await stage1(message)
    case 2:
      return await stage2(message)
    case 3:
      return await stage3(message)
    default:
      console.error('Invalid stage number:', stageNumber)
  }
}
