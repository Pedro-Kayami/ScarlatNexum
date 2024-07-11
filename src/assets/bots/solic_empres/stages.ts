import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { stage0 } from '@/assets/bots/solic_empres/stage/0'

export const stagesSolicEmpres = (
  message: MessageResponse,
  stageNumber: number,
) => {
  const stages = {
    '0': stage0,
  }

  const selectedStage = stages[stageNumber]
  if (selectedStage) {
    return selectedStage(message)
  } else {
    console.error('Invalid stage number:', stageNumber)
    // Handle invalid stage number appropriately
  }
}
