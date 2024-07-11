import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { stage0 } from '@/assets/bots/btc/stage/0'
import { stage1 } from '@/assets/bots/btc/stage/1'
import { stage2 } from '@/assets/bots/btc/stage/2'
import { stage3 } from '@/assets/bots/btc/stage/3'
import { stage4 } from '@/assets/bots/btc/stage/4'
import { stage5 } from '@/assets/bots/btc/stage/5'
import { stage6 } from '@/assets/bots/btc/stage/6'
import { stage7 } from '@/assets/bots/btc/stage/7_mercadolivre'
import { stage8 } from '@/assets/bots/btc/stage/8_mercadolivre'
import { stage9 } from '@/assets/bots/btc/stage/9_operacoes'
import { stage10 } from '@/assets/bots/btc/stage/10_operacoes'

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
    case 4:
      return await stage4(message)
    case 5:
      return await stage5(message)
    case 6:
      return await stage6(message)
    case 7:
      return await stage7(message)
    case 8:
      return await stage8(message)
    case 9:
      return await stage9(message)
    case 10:
      return await stage10(message)
    default:
      console.error('Invalid stage number:', stageNumber)
  }
}
